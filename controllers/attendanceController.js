const Attendance = require("../models/Attendance");
const User = require("../models/User");

const getAttendance = async (req, res) => {
  try {
    const { user, date, startDate, endDate, team } = req.query;
    const filter = {};
    if (user) filter.user = user;
    if (date) filter.date = date;
    if (startDate && endDate) {
      filter.date = { $gte: startDate, $lte: endDate };
    }

    let records = await Attendance.find(filter)
      .populate({
        path: "user",
        select: "name role team payoutType salaryAmount config",
        populate: { path: "role", select: "name" }
      })
      .sort({ date: -1 });

    if (team) {
      records = records.filter(r => r.user && r.user.team === team);
    }

    res.json(records);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const checkIn = async (req, res) => {
  try {
    const userId = req.user.id;
    const today = new Date().toISOString().split("T")[0];
    
    let attendance = await Attendance.findOne({ user: userId, date: today });
    
    if (!attendance) {
      attendance = new Attendance({
        user: userId,
        date: today,
        status: "Present",
        logs: [{ checkIn: new Date() }]
      });
    } else {
      // Check if last log is not closed
      const lastLog = attendance.logs[attendance.logs.length - 1];
      if (lastLog && !lastLog.checkOut) {
        return res.status(400).json({ message: "Already checked in" });
      }
      attendance.logs.push({ checkIn: new Date() });
      attendance.status = "Present";
    }
    
    await attendance.save();
    res.json(attendance);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const checkOut = async (req, res) => {
  try {
    const userId = req.user.id;
    const today = new Date().toISOString().split("T")[0];
    
    const attendance = await Attendance.findOne({ user: userId, date: today });
    if (!attendance) return res.status(404).json({ message: "No attendance record for today" });
    
    const lastLog = attendance.logs[attendance.logs.length - 1];
    if (!lastLog || lastLog.checkOut) {
      return res.status(400).json({ message: "Not checked in or already checked out" });
    }
    
    lastLog.checkOut = new Date();
    lastLog.duration = Math.round((lastLog.checkOut - lastLog.checkIn) / (1000 * 60)); // minutes
    
    attendance.totalMinutes = attendance.logs.reduce((sum, log) => sum + (log.duration || 0), 0);
    
    await attendance.save();
    res.json(attendance);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateAttendance = async (req, res) => {
  try {
    const { id } = req.params;
    let record;
    
    if (id === "new") {
      const { user, date } = req.body;
      record = await Attendance.findOne({ user, date });
      if (record) {
        Object.assign(record, { ...req.body, isManual: true });
        await record.save();
      } else {
        record = new Attendance({ ...req.body, isManual: true });
        await record.save();
      }
    } else {
      record = await Attendance.findByIdAndUpdate(id, { ...req.body, isManual: true }, { new: true });
    }

    if (!record) return res.status(404).json({ message: "Attendance record not found" });
    res.json(record);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const getMyStatus = async (req, res) => {
  try {
    const userId = req.user.id;
    // Find the most recent record with an open log OR today's record
    const today = new Date().toISOString().split("T")[0];
    let attendance = await Attendance.findOne({ user: userId, date: today });
    
    if (!attendance) {
      // Look for any open log from previous days (edge case)
      attendance = await Attendance.findOne({ 
        user: userId, 
        "logs.checkOut": { $exists: false } 
      }).sort({ date: -1 });
    }
    
    res.json(attendance);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getAttendance, checkIn, checkOut, updateAttendance, getMyStatus };
