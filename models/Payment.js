const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    project: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
    client: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    milestone: { type: String, required: true },
    amount: { type: Number, required: true },
    status: { type: String, enum: ["Paid", "Pending", "Overdue"], default: "Pending" },
    date: { type: String },
    notes: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payment", paymentSchema);
