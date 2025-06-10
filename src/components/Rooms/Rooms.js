import React, { useState, useEffect } from "react";
import { Users, Plus, MessageCircle, Clock } from "lucide-react";
import CreateRoomModal from "./CreateRoomModal";
import ChatRoom from "./ChatRoom";
import { useSocket } from "../../hooks/useSocket";
import { currentUser } from "../../data/mockData";

const Rooms = () => {
  const [rooms, setRooms] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [currentRoom, setCurrentRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const socket = useSocket();

  useEffect(() => {
    if (!socket) return;

    // Get initial rooms list
    socket.emit("get-rooms");

    // Listen for rooms list
    socket.on("rooms-list", (roomsList) => {
      setRooms(roomsList);
      setLoading(false);
    });

    // Listen for new rooms
    socket.on("new-room-available", (room) => {
      setRooms((prev) => [room, ...prev]);
    });

    // Listen for room creation success
    socket.on("room-created", (data) => {
      setCurrentRoom(data.room);
    });

    // Listen for room join success
    socket.on("room-joined", (data) => {
      setCurrentRoom(data.room);
    });

    // Listen for room errors
    socket.on("room-error", (error) => {
      alert(error.message);
    });

    return () => {
      socket.off("rooms-list");
      socket.off("new-room-available");
      socket.off("room-created");
      socket.off("room-joined");
      socket.off("room-error");
    };
  }, [socket]);

  const handleCreateRoom = (roomData) => {
    if (socket) {
      socket.emit("create-room", roomData);
    }
  };

  const handleJoinRoom = (roomId) => {
    if (socket) {
      socket.emit("join-room", {
        roomId: roomId,
        username: currentUser.name,
      });
    }
  };

  const handleLeaveRoom = () => {
    if (socket) {
      socket.emit("leave-room");
    }
    setCurrentRoom(null);
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now - time) / (1000 * 60));

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  if (currentRoom) {
    return (
      <ChatRoom
        room={currentRoom}
        socket={socket}
        currentUser={currentUser}
        onLeaveRoom={handleLeaveRoom}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Collaborative Rooms</h2>
          <p className="text-gray-600 mt-1">
            Join or create rooms to collaborate with other developers
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Create Room</span>
        </button>
      </div>

      {/* Rooms Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-lg shadow-sm border animate-pulse"
            >
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="h-8 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      ) : rooms.length === 0 ? (
        <div className="text-center py-12">
          <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No rooms available
          </h3>
          <p className="text-gray-500 mb-6">
            Be the first to create a collaborative room!
          </p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Create First Room
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.map((room) => (
            <div
              key={room.id}
              className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-all duration-200 hover:border-blue-200"
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-semibold text-lg text-gray-900">
                  {room.name}
                </h3>
                <div
                  className={`w-3 h-3 rounded-full ${
                    room.active ? "bg-green-500" : "bg-gray-400"
                  }`}
                ></div>
              </div>

              <p className="text-gray-600 text-sm mb-4">Topic: {room.topic}</p>

              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <div className="flex items-center space-x-1">
                  <Users className="w-4 h-4" />
                  <span>{room.members} members</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{formatTimeAgo(room.createdAt)}</span>
                </div>
              </div>

              <button
                onClick={() => handleJoinRoom(room.id)}
                className="w-full px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
              >
                Join Room
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Create Room Modal */}
      <CreateRoomModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreateRoom={handleCreateRoom}
        currentUser={currentUser}
      />
    </div>
  );
};

export default Rooms;
