const SiteTask = require("../models/SiteTask");
const OfficeTask = require("../models/OfficeTask");

const getTasks = async (req, res) => {
  try {
    const { project } = req.query;
    const filter = project ? { project } : {};

    const [siteTasks, officeTasks] = await Promise.all([
      SiteTask.find(filter).populate("project", "name").populate("assignedTo", "name"),
      OfficeTask.find(filter).populate("project", "name").populate("assignedTo", "name"),
    ]);

    const mapped = [
      ...siteTasks.map((t) => ({ ...t.toObject(), type: "Site" })),
      ...officeTasks.map((t) => ({ ...t.toObject(), type: "Office" })),
    ];

    res.json(mapped);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getTasks };
