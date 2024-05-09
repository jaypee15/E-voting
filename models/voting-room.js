const { Schema, model } = require("mongoose");

const votingRoomSchema = new Schema(
  {
    name: { type: String, required: true },
    admin: {
      type: Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
    contestants: [{ type: mongoose.Schema.Types.ObjectId, ref: "Contestant" }],
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    votingLink: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

const VotingRoom = model("VotingRoom", votingRoomSchema);
module.exports = VotingRoom;
