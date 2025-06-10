import React, { useState, useEffect, useRef } from "react";
import {
  ArrowLeft,
  Send,
  Users,
  Loader,
  Crown,
  UserX,
  Power,
} from "lucide-react";

const ChatRoom = ({ room, socket, currentUser, onLeaveRoom }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [members, setMembers] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState([]);
  const [isCreator, setIsCreator] = useState(false);
  const [showMemberActions, setShowMemberActions] = useState(false);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    if (!socket || !room) return;

    // Initialize room data
    setMessages(room.messages || []);
    setMembers(room.members || []);
    setIsCreator(room.createdBy === currentUser.name);

    // Listen for new messages
    socket.on("new-message", (messageData) => {
      setMessages((prev) => [...prev, messageData]);
    });

    // Listen for user join/leave
    socket.on("user-joined", (data) => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          type: "system",
          text: `${data.username} joined the room`,
          timestamp: data.timestamp,
        },
      ]);
    });

    socket.on("user-left", (data) => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          type: "system",
          text: `${data.username} left the room`,
          timestamp: data.timestamp,
        },
      ]);
    });

    socket.on("user-kicked", (data) => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          type: "system",
          text: `${data.username} was kicked by ${data.kickedBy}`,
          timestamp: data.timestamp,
        },
      ]);
    });

    // Listen for room ended
    socket.on("room-ended", (data) => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          type: "system",
          text: data.message,
          timestamp: data.timestamp,
        },
      ]);

      // Auto leave after 3 seconds
      setTimeout(() => {
        onLeaveRoom();
      }, 3000);
    });

    // Listen for being kicked
    socket.on("kicked-from-room", (data) => {
      alert(`You were kicked from "${data.roomName}" by ${data.kickedBy}`);
      onLeaveRoom();
    });

    // Listen for member count updates
    socket.on("member-count-updated", (data) => {
      setMembers((prev) => prev.filter((m) => m.isActive));
    });

    // Listen for typing indicators
    socket.on("user-typing", (data) => {
      if (data.isTyping) {
        setTypingUsers((prev) => [
          ...prev.filter((u) => u !== data.username),
          data.username,
        ]);
      } else {
        setTypingUsers((prev) => prev.filter((u) => u !== data.username));
      }
    });

    // Get updated room details
    socket.emit("get-room-details", { roomId: room.id });

    socket.on("room-details", (data) => {
      setMembers(data.room.members);
      setIsCreator(data.room.isCreator);
    });

    return () => {
      socket.off("new-message");
      socket.off("user-joined");
      socket.off("user-left");
      socket.off("user-kicked");
      socket.off("room-ended");
      socket.off("kicked-from-room");
      socket.off("member-count-updated");
      socket.off("user-typing");
      socket.off("room-details");
    };
  }, [socket, room, currentUser.name, onLeaveRoom]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!message.trim() || !socket) return;

    socket.emit("send-message", {
      roomId: room.id,
      message: message.trim(),
      username: currentUser.name,
    });

    setMessage("");
    handleStopTyping();
  };

  const handleTyping = (e) => {
    setMessage(e.target.value);

    if (!isTyping) {
      setIsTyping(true);
      socket.emit("typing", {
        roomId: room.id,
        username: currentUser.name,
        isTyping: true,
      });
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      handleStopTyping();
    }, 1000);
  };

  const handleStopTyping = () => {
    if (isTyping) {
      setIsTyping(false);
      socket.emit("typing", {
        roomId: room.id,
        username: currentUser.name,
        isTyping: false,
      });
    }
  };

  const handleEndRoom = () => {
    if (
      window.confirm(
        "Are you sure you want to end this room? All members will be removed."
      )
    ) {
      socket.emit("end-room", { roomId: room.id });
    }
  };

  const handleKickUser = (targetUserId) => {
    const member = members.find((m) => m.userId === targetUserId);
    if (window.confirm(`Are you sure you want to kick ${member?.username}?`)) {
      socket.emit("kick-user", { roomId: room.id, targetUserId });
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!room) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-sm border">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center space-x-3">
          <button
            onClick={onLeaveRoom}
            className="text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="font-semibold text-lg">{room.name}</h2>
              {isCreator && (
                <Crown
                  className="w-4 h-4 text-yellow-500"
                  title="Room Creator"
                />
              )}
            </div>
            <p className="text-sm text-gray-600">{room.topic}</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Users className="w-4 h-4" />
            <span>{members.filter((m) => m.isActive).length} members</span>
          </div>

          {isCreator && (
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowMemberActions(!showMemberActions)}
                className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
                title="Manage Members"
              >
                <UserX className="w-4 h-4" />
              </button>
              <button
                onClick={handleEndRoom}
                className="p-2 text-gray-600 hover:text-red-600 transition-colors"
                title="End Room"
              >
                <Power className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Member Actions Panel */}
      {showMemberActions && isCreator && (
        <div className="p-4 border-b bg-gray-50">
          <h3 className="text-sm font-medium mb-2">Room Members</h3>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {members
              .filter((m) => m.isActive)
              .map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between text-sm"
                >
                  <div className="flex items-center space-x-2">
                    <span>{member.username}</span>
                    {member.isCreator && (
                      <Crown className="w-3 h-3 text-yellow-500" />
                    )}
                  </div>
                  {!member.isCreator && (
                    <button
                      onClick={() => handleKickUser(member.userId)}
                      className="text-red-600 hover:text-red-800 text-xs"
                    >
                      Kick
                    </button>
                  )}
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${
              msg.type === "system"
                ? "justify-center"
                : msg.username === currentUser.name
                ? "justify-end"
                : "justify-start"
            }`}
          >
            {msg.type === "system" ? (
              <div className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                {msg.text}
              </div>
            ) : (
              <div
                className={`max-w-xs lg:max-w-md px-3 py-2 rounded-lg ${
                  msg.username === currentUser.name
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-900"
                }`}
              >
                {msg.username !== currentUser.name && (
                  <div className="text-xs font-medium mb-1 opacity-75">
                    {msg.username}
                  </div>
                )}
                <div className="text-sm">{msg.text}</div>
                <div
                  className={`text-xs mt-1 ${
                    msg.username === currentUser.name
                      ? "text-blue-100"
                      : "text-gray-500"
                  }`}
                >
                  {formatTime(msg.timestamp)}
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Typing indicator */}
        {typingUsers.length > 0 && (
          <div className="flex justify-start">
            <div className="bg-gray-100 px-3 py-2 rounded-lg">
              <div className="text-xs text-gray-600">
                {typingUsers.join(", ")}{" "}
                {typingUsers.length === 1 ? "is" : "are"} typing...
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <form onSubmit={handleSendMessage} className="p-4 border-t">
        <div className="flex space-x-2">
          <input
            type="text"
            value={message}
            onChange={handleTyping}
            placeholder="Type your message..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            type="submit"
            disabled={!message.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatRoom;
