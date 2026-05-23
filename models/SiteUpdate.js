const mongoose = require("mongoose");

const siteUpdateSchema = new mongoose.Schema(
  {
    project: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
    update: { type: String, required: true },
    progress: { type: Number, default: 0 },
    photos: [{ type: String }], // file paths or URLs
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    date: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SiteUpdate", siteUpdateSchema);
