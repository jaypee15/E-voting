const asyncHandler = require("express-async-handler");
const Flutterwave = require("flutterwave-node-v3");
const flw = new Flutterwave(
  process.env.FLW_PUBLIC_KEY,
  process.env.FLW_SECRET_KEY
);

const VotingRoom = require("../models/voting-room");
const ErrorObject = require("../utils/error");
const makePayment = require("../utils/payment");
const Transaction = require("../models/transaction");

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
  const {numVotes} = req.body;

  const redirectUrl = `${process.env.BASE_URL}/vote/payments/${contestantId}`;
  if (!numVotes) {
    return next(new ErrorObject("Number of votes id required", 400));
  }

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

  if (now < votingRoom.startDate || now > votingRoom.endDate) {
    return next(new ErrorObject("Voting is not open now", 400));
  }

  const contestant = votingRoom.contestants.find(
    (contestant) => contestant._id.toString() === contestantId
  );

  if (!contestant) {
    return next(new ErrorObject("Contestant not found", 404));
  }

  const amount = Math.round(numVotes) * 50;

  const options = {
    res,
    amount,
    redirectUrl,
    contestantId,
    votingRoomId: votingRoom._id,
  }

  const payment = makePayment(options);
  
});

const confirmPayment = asyncHandler(async (req, res, next) => {
  const {contestantId} = req.params;
  const {tx_ref} = req.query;
  
  if (req.query.status === "successful") {
    const transactionDetails = await Transaction.findOne({tx_ref});
    if (transactionDetails.isUsed === true) {
      return res.status(400).json({message: "Transaction already used"})
    }
    const response = await flw.Transaction.verify({
      id: req.query.transaction_id,
    });
    if (
      response.data.status === "successful" &&
      response.data.currency === "NGN"
    )
     {
      // Success! Confirm the customer's payment and increment
      const votingRoom = await VotingRoom.findOne({
        contestants: contestantId,
      }).populate("contestants");
      if (!votingRoom) {
        return next(
          new ErrorObject("Voting room not found for the given contestant", 404)
        );
      }
      
      const contestant = votingRoom.contestants.find(
        (contestant) => contestant._id.toString() === contestantId
      );
    
      if (!contestant) {
        return next(new ErrorObject("Contestant not found", 404));
      }

      // TODO: conditional increment of vote count
    
      // const amountPaid = response.data.amount;
      // 
      contestant.votes += 1;
      await contestant.save();
      transactionDetails.isUsed=true;
      transactionDetails.status=true
      await transactionDetails.save();

    
      res.status(201).json({ status: "voted succesfully", contestant });
    } else {
      // Inform the customer their payment was unsuccessful
      res.json("payment unsuccessful, try again");
    }
  }
});

module.exports = {
  viewRoom,
  vote,
  confirmPayment,
};
