// Verify if the user is authenticated before allowing access to certain routes

const jwt = require("jsonwebtoken");
const asyncHandler = require("expressAsyncHandler");
const ErrorObject = require("../utils/error");

const { SECRET } = process.env;

const protect = asyncHandler(async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    next(new ErrorObject("Unauthorized: No token provided", 401));
  }

  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    next(new ErrorObject("Unauthorized: Invalid token", 403));
  }
});

module.exports = protect;
