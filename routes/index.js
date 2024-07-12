const getChats = require("../controllers/readDB");
const express = require("express");
const createMessage = require("../controllers/writeDB");
const router = express.Router();
const Users = require("../models/users");
const Friendship = require("../models/friendship");
const socket = require("../socketSetup");
const purify = require("../purify");

router.get("/", async function (req, res) {
  if (!req.user) {
    res.redirect("/sign-in");
  } else {
    try {
      const chats = await getChats();
      const privateChats = await getChats(req.user.username);
      return res.status(200).render("index", {
        chatsbubbles: chats,
        username: req.user.username,
        friends: req.user.friends,
        unreadTarget: privateChats[0]?.unreadTarget,
        unreadCount: privateChats[0]?.unreadCount,
        settings: req.user.settings[0],
      });
    } catch (error) {
      console.log(error);
      return res.status(404).render("error");
    }
  }
});

router.post("/", async function (req, res) {
  const io = socket.getIO();
  if (req.body.newMessage) {
    const newMessage = JSON.parse(req.body.newMessage);
    const { name, message, time } = { ...newMessage };
    /// if priivate message
    if (req.body.target) {
      const target = req.body.target;
      const issuer = req.body.issuer;
      const targetSocketID = req.body.targetSocketID;
      const updatedPrivateChats = await createMessage(
        name,
        message,
        time,
        issuer,
        target,
        targetSocketID
      );
      if (targetSocketID && updatedPrivateChats) {
        io.to(targetSocketID).emit(
          "Update Messages",
          updatedPrivateChats,
          true,
          issuer
        );
        io.to(targetSocketID).emit("Play Sound");
      }
      return res.status(200).json(updatedPrivateChats);
    } else {
      /// if global message
      await createMessage(name, message, time);
      const updatedChats = await getChats();
      io.emit("Update Messages", updatedChats);
      return res.status(200);
    }
  }
});

router.get("/globalchats", async function (req, res) {
  try {
    const getGlobalChats = await getChats();
    if (getGlobalChats) {
      return res.status(200).json(getGlobalChats);
    }
  } catch (error) {
    console.log(error);
    return res.status(500);
  }
});

router.post("/friendchat", async function (req, res) {
  const issuer = req.body.issuer;
  const target = req.body.target;
  const participantsToSearch = [issuer, target];
  try {
    const getChats = await Friendship.find({
      participants: { $all: participantsToSearch },
    });
    if (getChats) {
      if (
        getChats[0].unreadTarget &&
        getChats[0].unreadTarget === issuer &&
        getChats[0].unreadCount > 0
      ) {
        getChats[0].unreadCount = 0;
        getChats[0].unreadTarget = "";
        await getChats[0].save();
      }
      res.status(200).json(getChats);
    } else {
      res.status(500);
    }
  } catch (error) {
    console.log(error);
    res.status(404);
  }
});

router.post("/addfriend", async function (req, res, next) {
  const io = socket.getIO();
  const friendEmail = purify(req.body.email);
  if (friendEmail === req.user.email) {
    return res.status(304).json({ addFriendError: "You can't add yourself" });
  }
  try {
    const findUser = await Users.findOne({ email: friendEmail }); /// find friend to add
    if (!findUser) {
      return res.status(304).json({ addFriendError: "No user found" });
    }
    const solicitor = req.user.email; /// client
    const solicitorUsername = req.user.username;
    const userFound = findUser.username; // friend found

    if (findUser) {
      if (findUser.friends.length > 0) {
        for (const friend of findUser.friends) {
          if (friend === solicitorUsername) {
            return res.status(304).json({
              addFriendError: "Friend already added",
            });
          }
        }
      }

      const updateSolicitor = await Users.findOneAndUpdate(
        { email: solicitor },
        { $push: { friends: userFound } },
        { new: true }
      );

      findUser.friends.push(solicitorUsername);
      await findUser.save();

      const newChat = new Friendship({
        participants: [solicitorUsername, userFound],
      });
      await newChat.save();

      io.emit("Friend Added", solicitorUsername, userFound);

      return res.status(200);
      // .render("index", { friends: updateSolicitor.friends });
    }
  } catch (error) {
    console.log(error);
    return error;
  }
});

module.exports = router;
