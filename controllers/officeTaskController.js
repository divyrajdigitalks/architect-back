const OfficeTask = require("../models/OfficeTask");
const { uploadToExternalAPI } = require("../middleware/upload");
const { recalculateProjectProgress } = require("../utils/projectProgress");

const getOfficeTasks = async (req, res) => {
  try {
    const { project } = req.query;
    const filter = project ? { project } : {};
    const tasks = await OfficeTask.find(filter)
      .populate("project", "name")
      .populate("assignedTo", "name email")
      .lean()
      .sort({ createdAt: -1 });

    const mappedTasks = tasks.map(task => {
      if (task.progress === 0 || task.progress == null) {
        if (task.status === 'Completed') task.progress = 100;
        else if (task.status === 'In Progress') task.progress = 50;
        else task.progress = 0;
      }
      return task;
    });

    res.json(mappedTasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getOfficeTask = async (req, res) => {
  try {
    const task = await OfficeTask.findById(req.params.id)
      .populate("project", "name")
      .populate("assignedTo", "name email");
    if (!task) return res.status(404).json({ message: "Office Task not found" });
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createOfficeTask = async (req, res) => {
  try {
    if (req.body.status) {
      if (req.body.status === 'Completed') req.body.progress = 100;
      else if (req.body.status === 'In Progress') req.body.progress = 50;
      else if (req.body.status === 'Pending') req.body.progress = 0;
    }
    const task = await OfficeTask.create(req.body);
    await recalculateProjectProgress(task.project);
    res.status(201).json(task);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const updateOfficeTask = async (req, res) => {
  try {
    if (req.body.status) {
      if (req.body.status === 'Completed') req.body.progress = 100;
      else if (req.body.status === 'In Progress') req.body.progress = 50;
      else if (req.body.status === 'Pending') req.body.progress = 0;
    }
    const task = await OfficeTask.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!task) return res.status(404).json({ message: "Office Task not found" });
    await recalculateProjectProgress(task.project);
    res.json(task);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const deleteOfficeTask = async (req, res) => {
  try {
    const task = await OfficeTask.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ message: "Office Task not found" });
    await recalculateProjectProgress(task.project);
    res.json({ message: "Office Task deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const uploadOfficeTaskImages = async (req, res) => {
  try {
    const task = await OfficeTask.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Office Task not found" });

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    const uploadPromises = req.files.map(file => uploadToExternalAPI(file, 'architect', 'office-tasks'));
    const imageUrls = await Promise.all(uploadPromises);
    const validUrls = imageUrls.filter(url => url !== null);

    task.images = [...(task.images || []), ...validUrls];
    await task.save();

    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteOfficeTaskImage = async (req, res) => {
  try {
    const task = await OfficeTask.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Office Task not found" });
    const { imageUrl } = req.body;
    task.images = (task.images || []).filter(img => img !== imageUrl);
    await task.save();
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getOfficeTasks, getOfficeTask, createOfficeTask, updateOfficeTask, deleteOfficeTask, uploadOfficeTaskImages, deleteOfficeTaskImage };
