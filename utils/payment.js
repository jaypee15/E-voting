require("dotenv").config();

const { v4: uuidv4 } = require("uuid");
const got = require("got");
const asyncHandler = require("express-async-handler");
const Transaction = require("../models/transaction");

const makePayment = asyncHandler(async (options) => {
  const tx_ref = uuidv4();
  const { amount, contestantId, votingRoomId, res, redirectUrl} =
    options;
  try {
    const transaction = await Transaction.create({
      amount,
      tx_ref,
      contestantId,
      votingRoomId,
    });
    const response = await got
      .post("https://api.flutterwave.com/v3/payments", {
        headers: {
          Authorization: `Bearer ${process.env.FLW_SECRET_KEY}`,
        },
        json: {
          tx_ref,
          amount: amount,
          currency: "NGN",
          redirect_url: redirectUrl,
          customer: {
            email: "voter@gmail.com",
          },
        },
      })
      .json();

    res
      .status(200)
      .json({ "follow this link to make your payment": response.data.link });
  } catch (err) {
    // console.log(err.code);
    // console.log(err.response.body);
    console.log(err);
  }
});

module.exports = makePayment;
