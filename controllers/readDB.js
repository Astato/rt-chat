const Chats = require("../models/chats");
const PrivateChat = require("../models/friendship");
const mongoose = require("mongoose");

const getChats = async (username) => {
  try {
    if (username) {
      const privateChat = await PrivateChat.find({
        participants: { $in: [username] },
      })
        .select("unreadCount unreadTarget")
        .limit(20);
      return privateChat;
    }
    const chatData = await Chats.find({}).sort({ time: -1 }).limit(20);
    return chatData;
  } catch (error) {
    console.log(error);
    return false;
  }
};

module.exports = getChats;
