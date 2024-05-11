const { Schema, model } = require("mongoose");

const votingRoomSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, unique: true, minLength: 5, maxLength:50 },
    admin: {
      type: Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
    contestants: [
      {
        type: Schema.Types.ObjectId,
        ref: "Contestant",
        required: true,
      },
    ],
    startDate: { type: Date, required: true, trim: true },
    endDate: { type: Date, required: true, trim: true },
    votingLink: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
  },
  { timestamps: true }
);

const VotingRoom = model("VotingRoom", votingRoomSchema);
module.exports = VotingRoom;
