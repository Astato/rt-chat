const Users = require("../models/users");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const purify = require("../purify");
const passport = require("passport");

router.post("/update", async (req, res) => {
  const user = req.user.username;
  const settings = req.body;
  try {
    const updateProfile = await Users.findOneAndUpdate(
      { username: user },
      { $set: { settings: settings } },
      { new: true }
    );

    if (updateProfile) {
      req.user.settings = updateProfile.settings;
      res.status(200).redirect("/");
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ profileUpdated: false });
  }
});

router.post("/change-creedentials", async (req, res) => {
  const currentPassword = req.body.currentPassword;
  const newPassword = req.body.newPassword;
  const newEmail = req.body.newEmail;
  const sanitizedPass = purify(currentPassword);
  const sanitizedEmail = purify(newEmail);
  const sanitizedNewPass = purify(newPassword);
  const username = req.user.username;

  if (newPassword) {
    try {
      const user = await Users.findOne({ username: username });
      const match = await bcrypt.compare(sanitizedPass, user.password);
      if (!match) {
        return res.status(401).render("signup", {
          creedentialsChangeError: "Incorrect Password",
        });
      } else {
        user.password = sanitizedNewPass;
        await user.save();
        const updateUser = req.user;
        updateUser.password = sanitizedNewPass;

        req.logIn(updateUser, async (error) => {
          if (error) {
            console.log(error);
            res.status(500).render("signup", {
              creedentialsChange:
                "Password has been changed but server failed to authenticate, please login again with your new creedentials",
            });
            return;
          }
          return res.status(200).render("signup", {
            creedentialsChange: "Password successfully changed",
          });
        });
      }
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .render("signup", { creedentialsChange: "Internal Error", error });
    }
  }

  if (newEmail) {
    try {
      const checkForEmailExistance = await Users.findOne({
        email: sanitizedEmail,
      });
      if (checkForEmailExistance) {
        return res.status(409).render("signup", {
          creedentialsChangeError: "Email already in use",
        });
      }
      const user = await Users.findOne({ username: username });
      const match = await bcrypt.compare(sanitizedPass, user.password);
      if (!match) {
        return res
          .status(401)
          .render("signup", { creedentialsChangeError: "Incorrect Password" });
      } else {
        user.email = sanitizedEmail;
        await user.save();
        const updateUser = req.user;
        updateUser.email = sanitizedEmail;

        req.logIn(updateUser, async (error) => {
          if (error) {
            console.log(error);
            res.status(500).render("signup", {
              creedentialsChange:
                "Email has been changed but server failed to authenticate, please login again with your new creedentials",
            });
            return;
          }
          return res.status(200).render("signup", {
            creedentialsChange: "Email successfully changed",
          });
        });
      }
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .render("signup", { creedentialsChange: "Internal Error", error });
    }
  }
});

router.get("/", async (req, res) => {
  if (!req.user.settings) {
    return res.status(304);
  }
  if (req.query.default) {
    const username = req.user.username;
    try {
      const updateProfile = await Users.findOneAndUpdate(
        { username: username },
        { $set: { settings: [] } },
        { new: true }
      );

      if (updateProfile) {
        req.user.settings = updateProfile.settings;
        res.status(200).redirect("/");
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({ profileUpdated: false });
    }
  }
});

module.exports = router;
