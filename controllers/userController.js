const User = require("../models/User");

const getUsers = async (req, res) => {
  try {
    const { role, team, trackAttendance } = req.query;
    const filter = {};
    if (role) filter.role = role;
    if (team) filter.team = team;
    if (trackAttendance !== undefined) filter.trackAttendance = trackAttendance === "true";

    const users = await User.find(filter)
      .select("-password")
      .populate("assignedProjects", "name status")
      .populate("role", "name permissions")
      .sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select("-password")
      .populate("assignedProjects", "name status")
      .populate("role", "name permissions");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const { password, ...rest } = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, rest, { new: true, runValidators: true }).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getUsers, getUser, updateUser, deleteUser };
