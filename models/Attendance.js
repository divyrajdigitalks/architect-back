const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema(
  {
    worker: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    project: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
    date: { type: String, required: true },
    status: { type: String, enum: ["Present", "Absent", "Half Day", "Leave"], default: "Present" },
    checkIn: { type: String },
    checkOut: { type: String },
    notes: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Attendance", attendanceSchema);
