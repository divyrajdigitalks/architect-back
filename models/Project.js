const mongoose = require("mongoose");

const stageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  status: { type: String, enum: ["Pending", "In Progress", "Completed"], default: "Pending" },
});

const projectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    client: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    location: { type: String, required: true },
    startDate: { type: String },
    expectedCompletion: { type: String },
    status: { type: String, enum: ["Planned", "In Progress", "Completed", "On Hold"], default: "Planned" },
    progress: { type: Number, default: 0, min: 0, max: 100 },
    budget: { type: Number, default: 0 }, 
    received: { type: Number, default: 0 },
    pending: { type: Number, default: 0 },
    designer: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    supervisor: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    workers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    stages: [stageSchema],
    description: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Project", projectSchema);
