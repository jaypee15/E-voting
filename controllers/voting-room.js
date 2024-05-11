require("dotenv").config();

const asyncHandler = require("express-async-handler");
const randomstring = require("randomstring");

const VotingRoom = require("../models/Voting-room");
const Contestant = require("../models/contestant");
const ErrorObject = require("../utils/error");

const createVotingRoom = asyncHandler(async (req, res, next) => {
  const { name, contestants, startDate, endDate } = req.body;
  const adminId = req.user.userId;

  const nameAlreadyExists = await VotingRoom.findOne({ name });
  if (nameAlreadyExists) {
    return next(new ErrorObject("A room with that name already exists", 400));
  }

  const path = req.originalUrl
  try {
    const link = `${process.env.BASE_URL}${path}/${randomstring.generate({
      length: 10,
      charset: "alphanumeric",
      capitalization: "lowercase",
    })}`;

    const contestantIds = [];
    for (const contestant of contestants) {
      const newContestant = await Contestant.create({
        name: contestant.name,
        image: contestant.image,
        username: contestant.username,
        votingRoom: null,
      });
      contestantIds.push(newContestant._id);
    }

    const votingRoom = await VotingRoom.create({
      name,
      contestants: contestantIds,
      startDate,
      endDate,
      votingLink: link,
      admin: adminId,
    });

    await Promise.all(
      contestantIds.map((id) =>
        Contestant.findByIdAndUpdate(id, { votingRoom: votingRoom._id })
      )
    );

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

const getVotingRoom = asyncHandler(async (req, res, next) => {
  console.log(req.params)
});

const getVotingRoomById = async (req, res, next) => {
  const votingRoom = await VotingRoom.findById(req.params.id);
  if (!votingRoom) {
    next(new ErrorObject("voting room not found", 404));
  }
  res.status(200).json(votingRoom);
};

const updateVotingRoom = async (req, res, next) => {
  // make a service
  const votingRoom = await VotingRoom.findById(req.params.id);
  if (!votingRoom) {
    next(new ErrorObject("Voting room not found", 404));
  }
  if (votingRoom.admin.toString() !== req.user.userId) {
    next(
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
    next(new ErrorObject("Voting room not found", 404));
  }
  if (votingRoom.admin.toString() !== req.user.userId) {
    next(
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
