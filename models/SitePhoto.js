const mongoose = require("mongoose");

const sitePhotoSchema = new mongoose.Schema(
  {
    project: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
    stage: { type: String },
    caption: { type: String },
    fileUrl: { type: String, required: true },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    date: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SitePhoto", sitePhotoSchema);
