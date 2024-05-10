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

router
  .route("/")
  .get(protect, getAllusers)
  .post(validate("register"), createUser);
router
  .route("/:id")
  .get(protect, getUserById)
  .patch(protect, validate("update"), updateUser)
  .delete(protect, deleteUser);
router.post("/login", validate("login"), loginUser);
router.post("/password-reset", resetPassword);
router
  .route("/password/:id")
  .post(forgotPassword, protect)
  .patch(updatePassword, protect);

module.exports = router;
