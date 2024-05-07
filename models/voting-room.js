const { Schema, model } = require("mongoose");

const votingRoomSchema = new Schema(
  {
    name: { type: String, required: true },
    admin: {
      type: Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
    contestants: [
      {
        name: { type: String, required: true },
        image: { type: String, required: true },
        username: { type: String, required: true, unique: true },
        user: { type: mongoose.Schema.Types.ObjectId, ref: "Voter" },
      },
    ],
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    votingLink: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

const VotingRoom = model("VotingRoom", votingRoomSchema);
module.exports = VotingRoom;
