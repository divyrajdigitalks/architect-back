const SitePhoto = require("../models/SitePhoto");
const path = require("path");

const getSitePhotos = async (req, res) => {
  try {
    const { project } = req.query;
    const filter = project ? { project } : {};
    const photos = await SitePhoto.find(filter)
      .populate("project", "name")
      .populate("uploadedBy", "name");
    res.json(photos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const uploadSitePhoto = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });
    const fileUrl = `/uploads/${req.file.filename}`;
    const photo = await SitePhoto.create({
      ...req.body,
      fileUrl,
      uploadedBy: req.user._id,
    });
    res.status(201).json(photo);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const deleteSitePhoto = async (req, res) => {
  try {
    const photo = await SitePhoto.findByIdAndDelete(req.params.id);
    if (!photo) return res.status(404).json({ message: "Photo not found" });
    res.json({ message: "Photo deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getSitePhotos, uploadSitePhoto, deleteSitePhoto };
