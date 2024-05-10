const asyncHandler = require("express-async-handler");

const VotingRoom = require("../models/Voting-room");
const ErrorObject = require("../utils/error");

const createVotingRoom = asyncHandler(async (req, res, next) => {
    const {name, admin, contestants, startDate, endDate} = req.body;
  const votingRoom = await VotingRoom.create(req.body);
  res.status(201).json(votingRoom);
});

const getAllVotingRooms = async (req, res) => {
  try {
    const votingRooms = await VotingRoom.find();
    res.json(votingRooms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getVotingRoomById = async (req, res) => {
  try {
    const votingRoom = await VotingRoom.findById(req.params.id);
    if (!votingRoom) {
      return res.status(404).json({ message: "Voting room not found" });
    }
    res.json(votingRoom);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateVotingRoom = async (req, res) => {
  try {
    const votingRoom = await VotingRoom.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!votingRoom) {
      return res.status(404).json({ message: "Voting room not found" });
    }
    res.json(votingRoom);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteVotingRoom = async (req, res) => {
  try {
    const votingRoom = await VotingRoom.findByIdAndDelete(req.params.id);
    if (!votingRoom) {
      return res.status(404).json({ message: "Voting room not found" });
    }
    res.json({ message: "Voting room deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createVotingRoom,
  getAllVotingRooms,
  getVotingRoomById,
  updateVotingRoom,
  deleteVotingRoom,
};
