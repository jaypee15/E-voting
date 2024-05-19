// load dependencies
const express = require("express");
const cookieParser = require("cookie-parser");

const ErrorHandler = require("./middlewares/error-handler");
const userRoutes = require("./routes/admin");
const votesRoutes = require("./routes/voting-room");
const voteRoutes = require("./routes/votes");

const app = express();

app.use(express.json());
app.use(cookieParser());

//Routes
app.use("/api/users", userRoutes);
app.use("/api/votes", votesRoutes);
app.use("/api/vote", voteRoutes);
app.use("*", (req, res, next) => {
  res.status(404).json({ message: " route not found" });
});

app.use(ErrorHandler);

module.exports = app;
