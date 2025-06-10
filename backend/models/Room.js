const mongoose = require("mongoose");

const memberSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  username: { type: String, required: true },
  socketId: { type: String, required: true },
  joinedAt: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true },
  isCreator: { type: Boolean, default: false },
  leftAt: Date,
  kickedAt: Date,
});

const messageSchema = new mongoose.Schema({
  id: { type: String, required: true },
  text: { type: String, required: true },
  username: { type: String, required: true },
  userId: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  type: { type: String, default: "text" },
});

const roomSchema = new mongoose.Schema({
  roomId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  topic: { type: String, required: true },
  createdBy: { type: String, required: true },
  creatorId: { type: String, required: true },
  creatorSocketId: String,
  isPrivate: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  members: [memberSchema],
  messages: [messageSchema],
  createdAt: { type: Date, default: Date.now },
  endedAt: Date,
});

module.exports = mongoose.model("Room", roomSchema);
