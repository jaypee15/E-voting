const asyncHandler = require("express-async-handler");

const Vote = require("../models/votes");
const VotingRoom = require("../models/voting-room");
const ErrorObject = require("../utils/error");

const viewRoom = asyncHandler(async (req, res, next) => {
  votingLink = `${process.env.BASE_URL}/vote${req.url}`;

  const votingRoom = await VotingRoom.findOne({ votingLink }).populate(
    "contestants"
  );

  if (!votingRoom) {
    return next(new ErrorObject("Voting room not found", 404));
  }

  const contestants = votingRoom.contestants.map((contestant) => ({
    id: contestant._id,
    name: contestant.name,
    image: contestant.image,
    username: contestant.username,
    votes: contestant.votes,
  }));

  // return the contestants from the votingrooms
  res.status(200).json({ status: "success", contestants });
});

const vote = asyncHandler(async (req, res, next) => {
  // get voting room from contestant id

  const { contestantId } = req.params;
  if (!contestantId) {
    return next(new ErrorObject("Contestant ID is required", 400));
  }

  const votingRoom = await VotingRoom.findOne({
    contestants: contestantId,
  }).populate("contestants");
  if (!votingRoom) {
    return next(
      new ErrorObject("Voting room not found for the given contestant", 404)
    );
  }

  const now = new Date();
  console.log(now);

  if (now < votingRoom.startDate || now > votingRoom.endDate) {
    return next(new ErrorObject("Voting is not open now", 400));
  }

  const contestant = votingRoom.contestants.find(
    (contestant) => contestant._id.toString() === contestantId
  );


  if (!contestant) {
    return next(new ErrorObject("Contestant not found", 404));
  }

  // implement flutterwave API logic to make payment and only allow vote if payment is succesfull

  // increment the contestant vote field by 1
  contestant.votes += 1;
  await contestant.save()

  res.status(201).json({status: "voted succesfully", contestant});
});

const getAllVotes = async (req, res) => {
  try {
    const votes = await Vote.find();
    if (!votes) {
      return res.status(500).json({ message: "Votes not found" });
    }
    res.json(votes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getVoteById = async (req, res) => {
  try {
    const vote = await Vote.findById(req.params.id);
    if (!vote) {
      return res.status(404).json({ message: "Vote not found" });
    }
    res.json(vote);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllVotes,
  getVoteById,
  viewRoom,
  vote,
};
