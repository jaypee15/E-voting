// load dependencies
const express = require("express");

const ErrorHandler = require("./middlewares/error-handler");
const userRoutes = require("./routes/user-routes");


const app = express();

app.use(express.json());

//Routes
app.use("/api/users", userRoutes);
app.use("*", (req, res, next) => {
  console.log(`route ${req.baseUrl} not found`);
  res.status(404).json({ message: "not found" });
});

app.use(ErrorHandler);

module.exports = app;
