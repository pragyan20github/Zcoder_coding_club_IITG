const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");
require("dotenv").config();

// Import database connection and services
const connectDB = require("./config/database");
const roomService = require("./services/roomService");

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

const io = socketIo(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

// Store active socket connections
const userSockets = new Map();

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Create a new room
  socket.on("create-room", async (roomData) => {
    try {
      const {
        roomName,
        topic,
        createdBy,
        userId,
        isPrivate = false,
      } = roomData;
      const roomId = generateRoomId();

      const room = await roomService.createRoom({
        roomId,
        roomName,
        topic,
        createdBy,
        creatorId: userId,
        creatorSocketId: socket.id,
        isPrivate,
      });

      userSockets.set(userId, socket.id);
      socket.join(roomId);

      // Send room created confirmation
      socket.emit("room-created", { roomId, room });

      // Broadcast new room to all users (if public)
      if (!isPrivate) {
        socket.broadcast.emit("new-room-available", {
          id: roomId,
          name: roomName,
          topic: topic,
          members: 1,
          active: true,
          createdBy: createdBy,
        });
      }

      console.log(`Room created: ${roomName} (${roomId}) by ${createdBy}`);
    } catch (error) {
      console.error("Error creating room:", error);
      socket.emit("room-error", { message: "Failed to create room" });
    }
  });

  // Join existing room
  socket.on("join-room", async (data) => {
    try {
      const { roomId, username, userId } = data;

      const room = await roomService.joinRoom(roomId, {
        userId,
        username,
        socketId: socket.id,
      });

      if (!room) {
        socket.emit("room-error", { message: "Room not found or inactive" });
        return;
      }

      userSockets.set(userId, socket.id);
      socket.join(roomId);

      // Send room data to user
      socket.emit("room-joined", { room });

      // Notify other room members
      socket.to(roomId).emit("user-joined", {
        username: username,
        userId: socket.id,
        timestamp: new Date(),
      });

      // Send updated member count
      const activeMemberCount = room.members.filter((m) => m.isActive).length;
      io.to(roomId).emit("member-count-updated", {
        count: activeMemberCount,
      });

      console.log(`${username} joined room: ${room.name}`);
    } catch (error) {
      console.error("Error joining room:", error);
      socket.emit("room-error", { message: "Failed to join room" });
    }
  });

  // Send message in room
  socket.on("send-message", async (data) => {
    try {
      const { roomId, message, username } = data;

      const messageData = {
        id: generateMessageId(),
        text: message,
        username: username,
        userId: socket.id,
        timestamp: new Date(),
        type: "text",
      };

      const room = await roomService.addMessage(roomId, messageData);

      if (!room) {
        socket.emit("room-error", { message: "Room not available" });
        return;
      }

      // Broadcast message to all room members
      io.to(roomId).emit("new-message", messageData);

      console.log(`Message in ${room.name}: ${username}: ${message}`);
    } catch (error) {
      console.error("Error sending message:", error);
      socket.emit("room-error", { message: "Failed to send message" });
    }
  });

  // End room (creator only)
  socket.on("end-room", async (data) => {
    try {
      const { roomId } = data;

      // Find the creator ID from socket mapping
      const creatorId = Array.from(userSockets.entries()).find(
        ([userId, socketId]) => socketId === socket.id
      )?.[0];

      const room = await roomService.endRoom(roomId, creatorId);

      if (!room) {
        socket.emit("room-error", {
          message: "Room not found or unauthorized",
        });
        return;
      }

      // Notify all members that room is ending
      io.to(roomId).emit("room-ended", {
        message: `Room "${room.name}" has been ended by the creator`,
        endedBy: room.createdBy,
        timestamp: new Date(),
      });

      // Remove all members from the room
      room.members.forEach((member) => {
        if (member.isActive) {
          const memberSocket = io.sockets.sockets.get(member.socketId);
          if (memberSocket) {
            memberSocket.leave(roomId);
          }
        }
      });

      console.log(`Room ${room.name} ended by creator ${room.createdBy}`);
    } catch (error) {
      console.error("Error ending room:", error);
      socket.emit("room-error", { message: "Failed to end room" });
    }
  });

  // Kick user (creator only)
  socket.on("kick-user", async (data) => {
    try {
      const { roomId, targetUserId } = data;

      const creatorId = Array.from(userSockets.entries()).find(
        ([userId, socketId]) => socketId === socket.id
      )?.[0];

      const room = await roomService.kickUser(roomId, creatorId, targetUserId);

      if (!room) {
        socket.emit("room-error", {
          message: "Unauthorized or room not found",
        });
        return;
      }

      const targetMember = room.members.find((m) => m.userId === targetUserId);
      if (targetMember) {
        const targetSocket = io.sockets.sockets.get(targetMember.socketId);
        if (targetSocket) {
          targetSocket.leave(roomId);
          targetSocket.emit("kicked-from-room", {
            roomName: room.name,
            kickedBy: room.createdBy,
            timestamp: new Date(),
          });
        }

        // Notify other members
        socket.to(roomId).emit("user-kicked", {
          username: targetMember.username,
          kickedBy: room.createdBy,
          timestamp: new Date(),
        });
      }

      console.log(`${targetMember?.username} kicked from ${room.name}`);
    } catch (error) {
      console.error("Error kicking user:", error);
      socket.emit("room-error", { message: "Failed to kick user" });
    }
  });

  // Typing indicator
  socket.on("typing", (data) => {
    const { roomId, username, isTyping } = data;
    socket.to(roomId).emit("user-typing", { username, isTyping });
  });

  // Leave room
  socket.on("leave-room", async () => {
    try {
      const userId = Array.from(userSockets.entries()).find(
        ([uid, socketId]) => socketId === socket.id
      )?.[0];

      if (userId) {
        // Find all rooms this user is in and leave them
        const rooms = await roomService.getPublicRooms();
        for (const roomData of rooms) {
          await roomService.leaveRoom(roomData.id, userId);
          socket.leave(roomData.id);
        }
      }
    } catch (error) {
      console.error("Error leaving room:", error);
    }
  });

  // Handle disconnect
  socket.on("disconnect", async () => {
    try {
      const userId = Array.from(userSockets.entries()).find(
        ([uid, socketId]) => socketId === socket.id
      )?.[0];

      if (userId) {
        userSockets.delete(userId);

        // Leave all rooms
        const rooms = await roomService.getPublicRooms();
        for (const roomData of rooms) {
          await roomService.leaveRoom(roomData.id, userId);
          socket.to(roomData.id).emit("user-left", {
            username: "User",
            userId: socket.id,
            timestamp: new Date(),
          });
        }
      }

      console.log(`User disconnected: ${socket.id}`);
    } catch (error) {
      console.error("Error handling disconnect:", error);
    }
  });

  // Get all public rooms
  socket.on("get-rooms", async () => {
    try {
      const publicRooms = await roomService.getPublicRooms();
      socket.emit("rooms-list", publicRooms);
    } catch (error) {
      console.error("Error getting rooms:", error);
      socket.emit("rooms-list", []);
    }
  });

  // Get room details
  socket.on("get-room-details", async (data) => {
    try {
      const { roomId } = data;
      const room = await roomService.getRoomById(roomId);

      if (!room) {
        socket.emit("room-error", { message: "Room not found" });
        return;
      }

      const userId = Array.from(userSockets.entries()).find(
        ([uid, socketId]) => socketId === socket.id
      )?.[0];

      const member = room.members.find((m) => m.userId === userId);
      if (!member) {
        socket.emit("room-error", {
          message: "You are not a member of this room",
        });
        return;
      }

      socket.emit("room-details", {
        room: {
          ...room.toObject(),
          members: room.members.filter((m) => m.isActive),
          isCreator: member.isCreator,
        },
      });
    } catch (error) {
      console.error("Error getting room details:", error);
      socket.emit("room-error", { message: "Failed to get room details" });
    }
  });
});

function generateRoomId() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

function generateMessageId() {
  return Date.now().toString() + Math.random().toString(36).substring(2, 5);
}

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
