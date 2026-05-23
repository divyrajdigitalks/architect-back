const Attendance = require("../models/Attendance");

const getAttendance = async (req, res) => {
  try {
    const { project, worker, date } = req.query;
    const filter = {};
    if (project) filter.project = project;
    if (worker) filter.worker = worker;
    if (date) filter.date = date;
    const records = await Attendance.find(filter)
      .populate("worker", "name role")
      .populate("project", "name");
    res.json(records);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const markAttendance = async (req, res) => {
  try {
    const { worker, project, date } = req.body;
    const existing = await Attendance.findOne({ worker, project, date });
    if (existing) {
      const updated = await Attendance.findByIdAndUpdate(existing._id, req.body, { new: true });
      return res.json(updated);
    }
    const record = await Attendance.create(req.body);
    res.status(201).json(record);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const updateAttendance = async (req, res) => {
  try {
    const record = await Attendance.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!record) return res.status(404).json({ message: "Attendance record not found" });
    res.json(record);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const deleteAttendance = async (req, res) => {
  try {
    const record = await Attendance.findByIdAndDelete(req.params.id);
    if (!record) return res.status(404).json({ message: "Attendance record not found" });
    res.json({ message: "Attendance record deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getAttendance, markAttendance, updateAttendance, deleteAttendance };
