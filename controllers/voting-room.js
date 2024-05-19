require("dotenv").config();

const asyncHandler = require("express-async-handler");
const { v4: uuidv4 } = require("uuid");

const VotingRoom = require("../models/voting-room");
const Contestant = require("../models/contestant");
const ErrorObject = require("../utils/error");

const createVotingRoom = asyncHandler(async (req, res, next) => {
  const { name, contestants, startDate, endDate } = req.body;
  const adminId = req.user.userId;

  const nameAlreadyExists = await VotingRoom.findOne({ name });
  if (nameAlreadyExists) {
    return next(new ErrorObject("A room with that name already exists", 400));
  }

  try {
    const link = `${process.env.BASE_URL}/vote/${uuidv4()}`;

    
    const votingRoom = await VotingRoom.create({
      name,
      contestants: null,
      startDate,
      endDate,
      votingLink: link,
      admin: adminId,
    });

    const contestantIds = [];
    for (const contestant of contestants) {
      const newContestant = await Contestant.create({
        name: contestant.name,
        image: contestant.image,
        username: contestant.username,
        votingRoom: votingRoom._id,
      });
      contestantIds.push(newContestant._id);
    }

  

    await VotingRoom.findByIdAndUpdate(votingRoom._id, {contestants: contestantIds})
    
    res.status(201).json({
      message: "Voting room created successfully",
      votingLink: link,
    });
  } catch (error) {
    next(new ErrorObject(error));
  }
});

const getAllVotingRooms = asyncHandler(async (req, res, next) => {
  // TODO: restrict to superdamin
  const votingRooms = await VotingRoom.find();
  res.status(200).json(votingRooms);
});


const getVotingRoomById = async (req, res, next) => {
  const votingRoom = await VotingRoom.findById(req.params.id);
  if (!votingRoom) {
    return next(new ErrorObject("voting room not found", 404));
  }
  res.status(200).json(votingRoom);
};

const updateVotingRoom = async (req, res, next) => {
  // make a service
  const votingRoom = await VotingRoom.findById(req.params.id);
  if (!votingRoom) {
    return next(new ErrorObject("Voting room not found", 404));
  }
  if (votingRoom.admin.toString() !== req.user.userId) {
    return next(
      new ErrorObject("You are not authorized to modify this voting room", 401)
    );
  }

  const updatedVotingRoom = await VotingRoom.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.status(200).json(updatedVotingRoom);
};

const deleteVotingRoom = async (req, res, next) => {
  const votingRoom = await VotingRoom.findById(req.params.id);
  if (!votingRoom) {
    return next(new ErrorObject("Voting room not found", 404));
  }

  if (votingRoom.admin.toString() !== req.user.userId) {
    return next(
      new ErrorObject("You are not authorized to modify this voting room", 401)
    );
  }

  await VotingRoom.findByIdAndDelete(req.params.id);

  res.status(200).json({ message: "Voting room deleted successfully" });
};

module.exports = {
  createVotingRoom,
  getAllVotingRooms,
  getVotingRoomById,
  updateVotingRoom,
  deleteVotingRoom,
};
