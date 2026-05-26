const Project = require("../models/Project");

// GET /api/projects
const getProjects = async (req, res) => {
  try {
    const projects = await Project.find()
      .populate("client", "name email phone")
      .populate("designer", "name email")
      .populate("supervisor", "name email")
      .populate("workers", "name email role")
      .sort({ createdAt: -1 });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/projects/:id
const getProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate("client", "name email phone")
      .populate("designer", "name email")
      .populate("supervisor", "name email")
      .populate("workers", "name email role specializations");
    if (!project) return res.status(404).json({ message: "Project not found" });
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/projects
const createProject = async (req, res) => {
  try {
    const project = await Project.create(req.body);
    res.status(201).json(project);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// PUT /api/projects/:id
const updateProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!project) return res.status(404).json({ message: "Project not found" });
    res.json(project);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// DELETE /api/projects/:id
const deleteProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });
    res.json({ message: "Project deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PATCH /api/projects/:id/stage
const updateStage = async (req, res) => {
  try {
    const { stageName, status } = req.body;
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });

    const stage = project.stages.find((s) => s.name === stageName);
    if (!stage) return res.status(404).json({ message: "Stage not found" });

    stage.status = status;
    await project.save();
    res.json(project);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = { getProjects, getProject, createProject, updateProject, deleteProject, updateStage };
