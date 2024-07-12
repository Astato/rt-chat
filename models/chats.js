const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ChatsSchema = new Schema(
  {
    name: { type: String, required: true, minLength: 4 },
    time: { type: Date, required: true },
    message: { type: String, required: true, minLength: 1 },
  },
  { collection: "history" }
);

module.exports = mongoose.model("Chats", ChatsSchema);
