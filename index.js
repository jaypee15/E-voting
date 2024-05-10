// load dependencies
const express = require("express");
const cookieParser = require("cookie-parser");

const ErrorHandler = require("./middlewares/error-handler");
const userRoutes = require("./routes/admin");

const app = express();

app.use(express.json());
app.use(cookieParser());

//Routes
app.use("/api/user", userRoutes);
app.use("*", (req, res, next) => {
  console.log(`route ${req.baseUrl} not found`);
  res.status(404).json({ message: "not found" });
});

app.use(ErrorHandler);

module.exports = app;
