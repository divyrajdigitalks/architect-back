const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    date: { type: String, required: true }, // Format: YYYY-MM-DD
    status: { type: String, enum: ["Present", "Absent", "Half Day", "Leave", "Weekly Off", "Overtime"], default: "Absent" },
    logs: [
      {
        checkIn: { type: Date },
        checkOut: { type: Date },
        duration: { type: Number, default: 0 }, // in minutes
      },
    ],
    totalMinutes: { type: Number, default: 0 },
    notes: { type: String },
    overtime: {
      type: { type: String, enum: ["hourly", "fixed"], default: "hourly" },
      hours: { type: Number, default: 0 },
      rate: { type: Number, default: 0 },
      amount: { type: Number, default: 0 }
    },
    isManual: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Attendance", attendanceSchema);
