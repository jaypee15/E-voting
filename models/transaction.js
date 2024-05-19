const { Schema, model } = require("mongoose");

const transactionSchema = new Schema(
  {
    room: { type: Schema.Types.ObjectId },
    contestant: { type: Schema.Types.ObjectId },
    amount: { type: Number },
    status: { type: Boolean, default: false },
    tx_ref: { type: String },
    isUsed: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Transaction = model("Transaction", transactionSchema);

module.exports = Transaction;
