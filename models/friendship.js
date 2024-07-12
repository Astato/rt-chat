const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const FriendshipSchema = new Schema(
  {
    participants: { type: Array, required: true },
    chat: { type: Array },
    unreadCount: { type: Number, default: 0 },
    unreadTarget: { type: String },
  },
  { collection: "friendship" }
);

module.exports = mongoose.model("Friendship", FriendshipSchema);
