const Room = require("../models/Room");
const User = require("../models/User");

class RoomService {
  // Create new room
  async createRoom(roomData) {
    try {
      const {
        roomId,
        roomName,
        topic,
        createdBy,
        creatorId,
        creatorSocketId,
        isPrivate,
      } = roomData;

      const room = new Room({
        roomId,
        name: roomName,
        topic,
        createdBy,
        creatorId,
        creatorSocketId,
        isPrivate,
        members: [
          {
            userId: creatorId,
            username: createdBy,
            socketId: creatorSocketId,
            isCreator: true,
            isActive: true,
          },
        ],
        messages: [],
      });

      await room.save();
      return room;
    } catch (error) {
      console.error("Error creating room:", error);
      throw error;
    }
  }

  // Get room by ID
  async getRoomById(roomId) {
    try {
      return await Room.findOne({ roomId, isActive: true });
    } catch (error) {
      console.error("Error getting room:", error);
      throw error;
    }
  }

  // Join room
  async joinRoom(roomId, userData) {
    try {
      const { userId, username, socketId } = userData;

      const room = await Room.findOne({ roomId, isActive: true });
      if (!room) return null;

      // Check if user already exists
      const existingMemberIndex = room.members.findIndex(
        (m) => m.userId === userId
      );

      if (existingMemberIndex !== -1) {
        // Update existing member
        room.members[existingMemberIndex].socketId = socketId;
        room.members[existingMemberIndex].isActive = true;
        room.members[existingMemberIndex].rejoinedAt = new Date();
      } else {
        // Add new member
        room.members.push({
          userId,
          username,
          socketId,
          isActive: true,
          isCreator: false,
        });
      }

      await room.save();
      return room;
    } catch (error) {
      console.error("Error joining room:", error);
      throw error;
    }
  }

  // Add message to room
  async addMessage(roomId, messageData) {
    try {
      const room = await Room.findOne({ roomId, isActive: true });
      if (!room) return null;

      room.messages.push(messageData);

      // Keep only last 100 messages
      if (room.messages.length > 100) {
        room.messages = room.messages.slice(-100);
      }

      await room.save();
      return room;
    } catch (error) {
      console.error("Error adding message:", error);
      throw error;
    }
  }

  // Leave room
  async leaveRoom(roomId, userId) {
    try {
      const room = await Room.findOne({ roomId });
      if (!room) return null;

      const memberIndex = room.members.findIndex((m) => m.userId === userId);
      if (memberIndex !== -1) {
        room.members[memberIndex].isActive = false;
        room.members[memberIndex].leftAt = new Date();
      }

      await room.save();
      return room;
    } catch (error) {
      console.error("Error leaving room:", error);
      throw error;
    }
  }

  // End room
  async endRoom(roomId, creatorId) {
    try {
      const room = await Room.findOne({ roomId, creatorId, isActive: true });
      if (!room) return null;

      room.isActive = false;
      room.endedAt = new Date();

      // Mark all members as inactive
      room.members.forEach((member) => {
        if (member.isActive) {
          member.isActive = false;
          member.leftAt = new Date();
        }
      });

      await room.save();
      return room;
    } catch (error) {
      console.error("Error ending room:", error);
      throw error;
    }
  }

  // Kick user
  async kickUser(roomId, creatorId, targetUserId) {
    try {
      const room = await Room.findOne({ roomId, creatorId, isActive: true });
      if (!room) return null;

      const memberIndex = room.members.findIndex(
        (m) => m.userId === targetUserId
      );
      if (memberIndex !== -1 && !room.members[memberIndex].isCreator) {
        room.members[memberIndex].isActive = false;
        room.members[memberIndex].kickedAt = new Date();
      }

      await room.save();
      return room;
    } catch (error) {
      console.error("Error kicking user:", error);
      throw error;
    }
  }

  // Get all public rooms
  async getPublicRooms() {
    try {
      const rooms = await Room.find({ isPrivate: false, isActive: true })
        .select("roomId name topic createdBy createdAt members")
        .lean();

      return rooms.map((room) => ({
        id: room.roomId,
        name: room.name,
        topic: room.topic,
        createdBy: room.createdBy,
        createdAt: room.createdAt,
        members: room.members.filter((m) => m.isActive).length,
        active: true,
      }));
    } catch (error) {
      console.error("Error getting public rooms:", error);
      throw error;
    }
  }
}

module.exports = new RoomService();
