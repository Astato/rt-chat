const Chats = require("../models/chats");
const PrivateChat = require("../models/friendship");
const mongoose = require("mongoose");

const createMessage = async (message, issuer, target) => {
  if (target && issuer) {
    const participants = [issuer, target];
    const privateChat = await PrivateChat.findOneAndUpdate(
      { participants: { $all: participants } },
      {
        $push: {
          chat: { $each: message },
        },
        $set: {
          unreadTarget: target,
        },
        $inc: { unreadCount: 1 },
      },
      { new: true }
    );
    return privateChat;
  } else {
    console.log(message, "HERE IS THE LAST MESSAGE OBJ");
    await Chats.insertMany(message)
      .then(() => "Messages Saves")
      .catch((error) => console.log(error));
  }
};

module.exports = createMessage;
