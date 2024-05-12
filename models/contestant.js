
const { Schema, model } = require("mongoose");

const contestantSchema = new Schema({
  name: { type: String, required: true },
  image: { type: String }, 
  username: { type: String, required: true, trim: true },
  votingRoom: {
    type: Schema.Types.ObjectId,
    ref: "VotingRoom",
  },

  // votes should return a count of the type of Vote model

  votes: {type: Number, default: 0, min: 0}

});

const Contestant = model("Contestant", contestantSchema);

module.exports = Contestant;

