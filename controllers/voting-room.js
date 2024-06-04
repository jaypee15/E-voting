require("dotenv").config();
const asyncHandler = require("express-async-handler");
const { v4: uuidv4 } = require("uuid");
const uploadImage = require("../utils/upload-image");
const VotingRoom = require("../models/voting-room");
const Contestant = require("../models/contestant");
const ErrorObject = require("../utils/error");
const multer = require("multer");


const storage = multer.diskStorage({});
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new ErrorObject("Please upload an image file", 400), false);
  }
};
const upload = multer({
  storage,
  fileFilter: multerFilter,
});

const uploadFiles = upload.any();

const createVotingRoom = asyncHandler(async (req, res, next) => {
  console.log("controller");
  const { name, startDate, endDate } = req.body;
  const adminId = req.user.userId;

  // Extract contestants from req.body
  const contestants = [];
  const contestantKeys = Object.keys(req.body).filter(key => key.startsWith('contestants'));

  contestantKeys.forEach(key => {
    const [, index, field] = key.match(/contestants\[(\d+)]\.(\w+)/);
    if (!contestants[index]) {
      contestants[index] = {};
    }
    contestants[index][field] = req.body[key];
  });

  console.log("req.files", req.files);
  console.log("contestants", contestants);

  const nameAlreadyExists = await VotingRoom.findOne({ name });
  if (nameAlreadyExists) {
    return next(new ErrorObject("A room with that name already exists", 400));
  }

  try {
    const link = `${process.env.BASE_URL}/vote/${uuidv4()}`;

    const votingRoom = await VotingRoom.create({
      name,
      contestants: [],
      startDate,
      endDate,
      votingLink: link,
      admin: adminId,
    });

    const contestantIds = [];
    const uploadedFiles = req.files || [];

    for (let i = 0; i < contestants.length; i++) {
      let avatar = "";
      const file = uploadedFiles.find(f => f.fieldname === `contestants[${i}].avatar`);

      if (file) {
        try {
          const image = {
            url: file.path,
            id: file.filename,
          };
          const result = await uploadImage(image);
          avatar = result.secure_url;
        } catch (error) {
          return res.status(500).json({ message: "Failed to upload Image" });
        }
      }

      const newContestant = await Contestant.create({
        name: contestants[i].name,
        image: avatar,
        username: contestants[i].username,
        votingRoom: votingRoom._id,
      });
      contestantIds.push(newContestant._id);
    }

    await VotingRoom.findByIdAndUpdate(votingRoom._id, {
      contestants: contestantIds,
    });

    res.status(201).json({
      message: "Voting room created successfully",
      votingLink: link,
    });
  } catch (error) {
    next(new ErrorObject(error.message, 500));
  }
});

module.exports = {
  createVotingRoom,
};

const getAllVotingRooms = asyncHandler(async (req, res, next) => {
  const votingRooms = await VotingRoom.find();
  res.status(200).json(votingRooms);
});

const getVotingRoomById = asyncHandler(async (req, res, next) => {
  const votingRoom = await VotingRoom.findById(req.params.id);
  if (!votingRoom) {
    return next(new ErrorObject("voting room not found", 404));
  }
  res.status(200).json(votingRoom);
});

const updateVotingRoom = asyncHandler(async (req, res, next) => {
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
});

const deleteVotingRoom = asyncHandler(async (req, res, next) => {
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
});

module.exports = {
  createVotingRoom,
  getAllVotingRooms,
  getVotingRoomById,
  updateVotingRoom,
  deleteVotingRoom,
  uploadFiles,
};
