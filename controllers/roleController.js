const Role = require("../models/Role");

const getRoles = async (req, res) => {
  try {
    const roles = await Role.find().sort({ createdAt: -1 });
    res.json(roles);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getRole = async (req, res) => {
  try {
    const role = await Role.findById(req.params.id);
    if (!role) return res.status(404).json({ message: "Role not found" });
    res.json(role);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createRole = async (req, res) => {
  try {
    const { name, description, permissions } = req.body;
    const roleExists = await Role.findOne({ name });
    if (roleExists) return res.status(400).json({ message: "Role already exists" });

    const role = await Role.create({ name, description, permissions });
    res.status(201).json(role);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const updateRole = async (req, res) => {
  try {
    const role = await Role.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!role) return res.status(404).json({ message: "Role not found" });
    res.json(role);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const deleteRole = async (req, res) => {
  try {
    const role = await Role.findByIdAndDelete(req.params.id);
    if (!role) return res.status(404).json({ message: "Role not found" });
    res.json({ message: "Role deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getRoles, getRole, createRole, updateRole, deleteRole };
