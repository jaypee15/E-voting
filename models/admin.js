const { Schema, model } = require("mongoose");
const bcrypt = require("bcrypt");

const adminSchema = new Schema(
  {
    email: {
      type: String,
      unique: [true, "a user with this email already exists"],
      required: [true, "Please provide an email address"],
      trim: true,
      lowerCase: true,
    },

    accountName: { type: String, required: true },
    accountNumber: { type: String, required: true },
    accountBank: { type: String, required: true },

    votingRooms: [{ type: Schema.Types.ObjectId, ref: "VotingRoom" }],

    password: {
      type: String,
      required: [true, "user must have a password"],
      select: false,
      minLength: [8, "Password must ba at least 8 characters"],
    },

    resetPasswordOTP: {
      type: String,
    },

    resetPasswordExpires: {
      type: Date,
    },
  },
  { timestamps: true }
);

adminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const Admin = model("Admin", adminSchema);

module.exports = Admin;
