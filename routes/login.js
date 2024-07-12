const express = require("express");
const router = express.Router();
const Users = require("../models/users");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const socket = require("../socketSetup");
const purify = require("../purify");

// const Recaptcha = require("express-recaptcha").RecaptchaV3;
// const recaptcha = new Recaptcha("SITE_KEY", "SECRET_KEY", { callback: "cb" });
passport.use(
  new LocalStrategy(
    { usernameField: "email", passwordField: "password" },
    async (email, password, done) => {
      const sanitezedEmail = purify(email);
      const sanitezedPass = purify(password);
      try {
        const user = await Users.findOne({ email: sanitezedEmail }).exec();
        if (!user) {
          return done(null, false, { message: "Incorrect Email" });
        }
        const match = await bcrypt.compare(sanitezedPass, user.password);
        if (!match) {
          return done(null, false, { message: "Incorrect Password" });
        }
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(async function (id, done) {
  try {
    const user = await Users.findById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

router.get("/", function (req, res, next) {
  // captcha: res.recaptcha,
  res.render("login", {
    message: req.session.messages,
  });
});

router.get("/logout", async function (req, res, next) {
  const io = socket.getIO();

  if (req.query.activeChats) {
    const issuerSocket = req.query.socket;
    const chatKeys = req.query.activeChats.split(",");
    await io.to(issuerSocket).emit("Disconnect Request", chatKeys);
  }
  req.logOut(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

router.post(
  "/",
  passport.authenticate("local", {
    failureMessage: true,
    failureFlash: false,
    failureRedirect: "/sign-in",
  }),
  function (req, res) {
    // req.session.email = req.user.email;
    // req.session.user = req.user.username;
    // req.session.friends = req.user.friends;
    // req.session.settings = req.user.settings;
    res.redirect("/");
  }
);

// });

module.exports = router;
