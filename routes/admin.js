const express = require("express");

const {
  createUser,
  getAllusers,
  getUserById,
  updateUser,
  deleteUser,
  updatePassword,
  forgotPassword,
  resetPassword,
  loginUser,
} = require("../controllers/admin");

const validate = require("../middlewares/validator");
const protect = require("../middlewares/protect");

const router = express.Router();

// Register route
router.post("/", validate("register"), createUser);

// Login route
router.post("/login", validate("login"), loginUser);

// Password reset route
router.post("/password-reset", resetPassword);

// Protected routes (require authentication)
router.use(protect);

// User management routes
router.get("/", getAllusers);
router.get("/:id", getUserById);
router.patch("/:id", validate("update"), updateUser);
router.delete("/:id", deleteUser);

// Password update route
router.patch("/password/:id", updatePassword);

// Forgot password route
router.post("/password/:id", forgotPassword);

module.exports = router;
