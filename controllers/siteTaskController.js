const SiteTask = require("../models/SiteTask");

const getSiteTasks = async (req, res) => {
  try {
    const { project } = req.query;
    const filter = project ? { project } : {};
    const tasks = await SiteTask.find(filter)
      .populate("project", "name")
      .populate("assignedTo", "name email");
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getSiteTask = async (req, res) => {
  try {
    const task = await SiteTask.findById(req.params.id)
      .populate("project", "name")
      .populate("assignedTo", "name email");
    if (!task) return res.status(404).json({ message: "Site Task not found" });
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createSiteTask = async (req, res) => {
  try {
    const task = await SiteTask.create(req.body);
    res.status(201).json(task);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const updateSiteTask = async (req, res) => {
  try {
    const task = await SiteTask.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!task) return res.status(404).json({ message: "Site Task not found" });
    res.json(task);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const deleteSiteTask = async (req, res) => {
  try {
    const task = await SiteTask.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ message: "Site Task not found" });
    res.json({ message: "Site Task deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getSiteTasks, getSiteTask, createSiteTask, updateSiteTask, deleteSiteTask };
