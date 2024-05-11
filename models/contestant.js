const { Schema, model } = require("mongoose");

const contestantSchema = new Schema({
  name: { type: String, required: true },
  image: { type: String }, 
  username: { type: String, required: true },
  votingRoom: {
    type: Schema.Types.ObjectId,
    ref: "VotingRoom",
  },

});

const Contestant = model("Contestant", contestantSchema);

module.exports = Contestant;
