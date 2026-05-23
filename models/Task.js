const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    project: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
    stage: { type: String },
    description: { type: String },
    officeTeam: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    officeStatus: { type: String, enum: ["Pending", "In Progress", "Completed"], default: "Pending" },
    siteTeam: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    siteStatus: { type: String, enum: ["Pending", "In Progress", "Completed"], default: "Pending" },
    deadline: { type: String },
    priority: { type: String, enum: ["Low", "Medium", "High"], default: "Medium" },
    notes: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Task", taskSchema);
