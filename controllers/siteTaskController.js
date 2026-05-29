const SiteTask = require("../models/SiteTask");
const { uploadToExternalAPI } = require("../middleware/upload");
const { recalculateProjectProgress } = require("../utils/projectProgress");

const getSiteTasks = async (req, res) => {
  try {
    const { project } = req.query;
    const filter = project ? { project } : {};
    const tasks = await SiteTask.find(filter)
      .populate("project", "name")
      .populate("assignedTo", "name email")
      .lean()
      .sort({ createdAt: -1 });

    const mappedTasks = tasks.map(task => {
      if (task.progress === 0 || task.progress == null) {
        if (task.status === 'Completed') task.progress = 100;
        else if (task.status === 'In Progress' || task.status === 'On Track') task.progress = 50;
        else if (task.status === 'Critical' || task.status === 'Delayed') task.progress = 25;
        else task.progress = 0;
      }
      return task;
    });

    res.json(mappedTasks);
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
    if (req.body.status) {
      if (req.body.status === 'Completed') req.body.progress = 100;
      else if (req.body.status === 'In Progress' || req.body.status === 'On Track') req.body.progress = 50;
      else if (req.body.status === 'Critical' || req.body.status === 'Delayed') req.body.progress = 25;
      else req.body.progress = 0;
    }
    const task = await SiteTask.create(req.body);
    await recalculateProjectProgress(task.project);
    res.status(201).json(task);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const updateSiteTask = async (req, res) => {
  try {
    if (req.body.status) {
      if (req.body.status === 'Completed') req.body.progress = 100;
      else if (req.body.status === 'In Progress' || req.body.status === 'On Track') req.body.progress = 50;
      else if (req.body.status === 'Critical' || req.body.status === 'Delayed') req.body.progress = 25;
      else req.body.progress = 0;
    }
    const task = await SiteTask.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!task) return res.status(404).json({ message: "Site Task not found" });
    await recalculateProjectProgress(task.project);
    res.json(task);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const deleteSiteTask = async (req, res) => {
  try {
    const task = await SiteTask.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ message: "Site Task not found" });
    await recalculateProjectProgress(task.project);
    res.json({ message: "Site Task deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const uploadSiteTaskImages = async (req, res) => {
  try {
    const task = await SiteTask.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Site Task not found" });

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    const uploadPromises = req.files.map(file => uploadToExternalAPI(file, 'architect', 'site-tasks'));
    const imageUrls = await Promise.all(uploadPromises);
    const validUrls = imageUrls.filter(url => url !== null);

    task.images = [...(task.images || []), ...validUrls];
    await task.save();

    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteSiteTaskImage = async (req, res) => {
  try {
    const task = await SiteTask.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Site Task not found" });
    const { imageUrl } = req.body;
    task.images = (task.images || []).filter(img => img !== imageUrl);
    await task.save();
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getSiteTasks, getSiteTask, createSiteTask, updateSiteTask, deleteSiteTask, uploadSiteTaskImages, deleteSiteTaskImage };
