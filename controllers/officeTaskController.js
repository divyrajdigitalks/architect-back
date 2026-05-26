const OfficeTask = require("../models/OfficeTask");
const { uploadToExternalAPI } = require("../middleware/upload");

const getOfficeTasks = async (req, res) => {
  try {
    const { project } = req.query;
    const filter = project ? { project } : {};
    const tasks = await OfficeTask.find(filter)
      .populate("project", "name")
      .populate("assignedTo", "name email")
      .sort({ createdAt: -1 });
    res.json(tasks);
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
    const task = await OfficeTask.create(req.body);
    res.status(201).json(task);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const updateOfficeTask = async (req, res) => {
  try {
    const task = await OfficeTask.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!task) return res.status(404).json({ message: "Office Task not found" });
    res.json(task);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const deleteOfficeTask = async (req, res) => {
  try {
    const task = await OfficeTask.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ message: "Office Task not found" });
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

module.exports = { getOfficeTasks, getOfficeTask, createOfficeTask, updateOfficeTask, deleteOfficeTask, uploadOfficeTaskImages };
