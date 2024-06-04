const express = require("express");

const protect = require("../middlewares/protect");
const validate = require("../middlewares/validator");

const {
  createVotingRoom,
  getAllVotingRooms,
  getVotingRoomById,
  updateVotingRoom,
  deleteVotingRoom,
  uploadFiles
} = require("../controllers/voting-room");


const router = express.Router();

// Protected routes (require authentication)
router.use(protect);

router.post("/voting-rooms", uploadFiles, createVotingRoom);
router.get("/voting-rooms", getAllVotingRooms);
router.get("/voting-rooms/:id", getVotingRoomById);
router.patch(
  "/voting-rooms/:id",
  validate("updateVotingRoom"),
  updateVotingRoom
);
router.delete("/voting-rooms/:id", deleteVotingRoom);

module.exports = router;
