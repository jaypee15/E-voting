const { Schema, model } = require("mongoose");

const voteSchema = new Schema(
  {
    voter: { type: Schema.Types.ObjectId, ref: "Voter", required: true },
    contestant: {
      type: Schema.Types.ObjectId,
      ref: "Contestant",
      required: true,
    },
  },
  { timestamps: true }
);

const Vote = model("Vote", voteSchema);

module.exports = Vote;
