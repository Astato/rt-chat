var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const flash = require("connect-flash");

const loginRouter = require("./routes/login");
const indexRouter = require("./routes/index");
const signupRouter = require("./routes/singup");
const passwordRouter = require("./routes/passrecovery");
const profileRouter = require("./routes/profile");
var app = express();
require("dotenv").config();

const CONNECT = process.env.CONNECT;

mongoose.set("strictQuery", false);
const mongoDB = CONNECT;

const main = async () => {
  await mongoose.connect(mongoDB);
};

main().catch((err) => console.log(err));
mongoose.connection.on("open", () => {
  console.log("Connected to DB");
});

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: "this-isa-random-string",
    resave: false,
    saveUninitialized: true,
  })
);
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use("/", indexRouter);
app.use("/sign-in", loginRouter);
app.use("/sign-up", signupRouter);
app.use("/password-recovery", passwordRouter);
app.use("/profile", profileRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
