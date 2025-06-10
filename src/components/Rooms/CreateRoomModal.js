import React, { useState } from "react";
import { X, Users, Lock, Globe } from "lucide-react";

const CreateRoomModal = ({ isOpen, onClose, onCreateRoom, currentUser }) => {
  const [roomName, setRoomName] = useState("");
  const [topic, setTopic] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!roomName.trim() || !topic.trim()) return;

    setLoading(true);

    const roomData = {
      roomName: roomName.trim(),
      topic: topic.trim(),
      createdBy: currentUser.name,
      userId: currentUser.id, // Pass user ID
      isPrivate: isPrivate,
    };

    await onCreateRoom(roomData);

    // Reset form
    setRoomName("");
    setTopic("");
    setIsPrivate(false);
    setLoading(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Create New Room</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Room Name
            </label>
            <input
              type="text"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              placeholder="Enter room name..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Topic
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="What will you discuss?"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={() => setIsPrivate(!isPrivate)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg border transition-colors ${
                isPrivate
                  ? "bg-orange-50 border-orange-200 text-orange-700"
                  : "bg-green-50 border-green-200 text-green-700"
              }`}
            >
              {isPrivate ? (
                <Lock className="w-4 h-4" />
              ) : (
                <Globe className="w-4 h-4" />
              )}
              <span>{isPrivate ? "Private Room" : "Public Room"}</span>
            </button>
          </div>

          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="text-sm text-blue-700">
              <strong>As room creator, you can:</strong>
            </p>
            <ul className="text-xs text-blue-600 mt-1 space-y-1">
              <li>• Kick members from the room</li>
              <li>• End the room at any time</li>
              <li>• Room ends automatically if you leave</li>
            </ul>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !roomName.trim() || !topic.trim()}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "Creating..." : "Create Room"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateRoomModal;
