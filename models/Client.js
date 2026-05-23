const mongoose = require("mongoose");

const clientSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String },
    email: { type: String, lowercase: true },
    address: { type: String },
    projects: [{ type: mongoose.Schema.Types.ObjectId, ref: "Project" }],
    paymentStatus: { type: String, enum: ["Paid", "Pending", "Overdue"], default: "Pending" },
    notes: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Client", clientSchema);
