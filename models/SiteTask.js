const mongoose = require("mongoose");

const siteTaskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    project: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
    category: { type: String, enum: ["Civil", "Interior"], required: true },
    assignedTo: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    status: { type: String, enum: ["Pending", "In Progress", "Completed", "Critical", "Delayed", "On Track"], default: "On Track" },
    progress: { type: Number, default: 0, min: 0, max: 100 },
    startDate: { type: String },
    endDate: { type: String },
    notes: { type: String },
    images: [{ type: String }],
    inspections: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SiteTask", siteTaskSchema);
