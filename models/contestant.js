const { Schema, model } = require("mongoose");

const contestantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String }, 
  username: { type: String, unique: true, required: true },
  votingRoom: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "VotingRoom",
    required: true,
  },

});

const Contestant = model("Contestant", contestantSchema);

module.exports = Contestant;
