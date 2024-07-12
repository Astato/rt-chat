const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Users = require("../models/users");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const purify = require("../purify");
require("dotenv").config();
const EMAIL = process.env.EMAIL;
const ID = process.env.ID;

const transporter = nodemailer.createTransport({
  host: "smtp.office365.com",
  port: 587,
  secure: false,
  auth: {
    user: EMAIL,
    pass: ID,
  },
});

async function generatePassword() {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let newPassword = "";
  for (let i = 0; i < 9; i++) {
    newPassword += characters.charAt(
      Math.floor(Math.random() * characters.length - 1)
    );
  }
  return newPassword;
}

async function sendEmail(mailOptions) {
  return transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log("Email Sent", info.response);
    }
  });
}

async function resetPassword(email) {
  try {
    const user = await Users.findOne({ email: email });
    if (user) {
      const newPassword = await generatePassword();
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
      await user.save();
      const mailOptions = {
        from: EMAIL,
        to: user.email,
        subject: "Message App Password Recovery",
        html: `
    <p>Hello <strong style="font-size: 18px">${user.username}!<strong></p>
    <p>Your new password is: <strong style="font-size: 21px">${newPassword}</strong></p>
    <p>If you can't find the email, check your spam folder!</p>
    <p>Thank you!</p>
    `,
      };
      await sendEmail(mailOptions);
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.log(error);
    return error;
  }
}

router.get("/", function (req, res, next) {
  res.render("login", { recovery: true });
});

router.post("/", async function (req, res, next) {
  const email = purify(req.body.emailRecovery);
  try {
    const data = await resetPassword(email);
    if (!data) {
      return res.render("login", { recovery: true, data: false });
    } else {
      return res.render("login", { recovery: true, data: true });
    }
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
