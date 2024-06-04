// load dependencies
const express = require("express");
const morgan = require("morgan");
const fs = require("fs");
const path = require("path");

const cookieParser = require("cookie-parser");

const ErrorHandler = require("./middlewares/error-handler");
const userRoutes = require("./routes/admin");
const votesRoutes = require("./routes/voting-room");
const voteRoutes = require("./routes/votes");

const app = express();
// const accessLogStream = fs.createWriteStream(
//   path.join(__dirname, "access.log"),
//   { flags: "a" }
// );

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
// setup the logger
// app.use(morgan("combined", { stream: accessLogStream }));
app.use(morgan("combined"))

//Routes
app.use("/api/users", userRoutes);
app.use("/api/votes", votesRoutes);
app.use("/api/vote", voteRoutes);
app.use("*", (req, res, next) => {
  res.status(404).json({ message: " route not found" });
});

app.use(ErrorHandler);

module.exports = app;
