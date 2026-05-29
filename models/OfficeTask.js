const mongoose = require("mongoose");

const officeTaskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    project: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
    category: { type: String, enum: ["Civil", "Interior"], required: true },
    assignedTo: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    status: { type: String, enum: ["Pending", "In Progress", "Completed"], default: "Pending" },
    progress: { type: Number, default: 0, min: 0, max: 100 },
    startDate: { type: String },
    endDate: { type: String },
    priority: { type: String, enum: ["Low", "Medium", "High", "Critical"], default: "Medium" },
    notes: { type: String },
    images: [{ type: String }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("OfficeTask", officeTaskSchema);
