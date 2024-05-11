// load dependencies
const express = require("express");
const cookieParser = require("cookie-parser");

const ErrorHandler = require("./middlewares/error-handler");
const userRoutes = require("./routes/admin");
const voteRoutes = require("./routes/voting-room");

const app = express();

app.use(express.json());
app.use(cookieParser());

//Routes
app.use("/api/users", userRoutes);
app.use("/api/votes", voteRoutes);
app.use("*", (req, res, next) => {
  console.log(`route ${req.originalUrl} not found`);
  res.status(404).json({ message: " route not found" });
});

app.use(ErrorHandler);

module.exports = app;
