const express = require("express");
const router = express.Router();
const Users = require("../models/users");
const bcrypt = require("bcryptjs");
const purify = require("../purify");

async function writeUser(username, email, password) {
  const getUser = await Users.findOne({
    $or: [{ email: email }, { username: username }],
  }).exec();
  if (getUser) {
    if (getUser.email === email) {
      return "Email already in use";
    }
    if (getUser.username === username) {
      return "Username already in use";
    }
  } else {
    const newUser = new Users({
      username: username,
      email: email,
      password: password,
    });
    await newUser
      .save()
      .then(() => console.log("user saved"))
      .catch((error) => console.log(error));
  }
}

router.get("/", function (req, res, next) {
  res.redirect("/sign-in");
});

router.post("/", async function (req, res, next) {
  const password = purify(req.body.password);
  const email = purify(req.body.email);
  const username = purify(req.body.username);
  bcrypt.hash(password, 10, async function (err, hash) {
    try {
      const saveUser = await writeUser(username, email, hash);
      // console.log(saveUser);
      res.render("signup", { errorMessage: saveUser });
    } catch (error) {
      console.log(error);
    }
  });
});

module.exports = router;
