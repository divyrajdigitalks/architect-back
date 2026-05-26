const SiteUpdate = require("../models/SiteUpdate");

const getSiteUpdates = async (req, res) => {
  try {
    const { project } = req.query;
    const filter = project ? { project } : {};
    const updates = await SiteUpdate.find(filter)
      .populate("project", "name")
      .populate("postedBy", "name")
      .sort({ createdAt: -1 });
    res.json(updates);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getSiteUpdate = async (req, res) => {
  try {
    const update = await SiteUpdate.findById(req.params.id)
      .populate("project", "name")
      .populate("postedBy", "name");
    if (!update) return res.status(404).json({ message: "Site update not found" });
    res.json(update);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createSiteUpdate = async (req, res) => {
  try {
    const update = await SiteUpdate.create({ ...req.body, postedBy: req.user._id });
    res.status(201).json(update);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const updateSiteUpdate = async (req, res) => {
  try {
    const update = await SiteUpdate.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!update) return res.status(404).json({ message: "Site update not found" });
    res.json(update);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const deleteSiteUpdate = async (req, res) => {
  try {
    const update = await SiteUpdate.findByIdAndDelete(req.params.id);
    if (!update) return res.status(404).json({ message: "Site update not found" });
    res.json({ message: "Site update deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getSiteUpdates, getSiteUpdate, createSiteUpdate, updateSiteUpdate, deleteSiteUpdate };
