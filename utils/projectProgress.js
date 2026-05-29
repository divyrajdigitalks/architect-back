const OfficeTask = require("../models/OfficeTask");
const SiteTask = require("../models/SiteTask");
const Project = require("../models/Project");

const recalculateProjectProgress = async (projectId) => {
  try {
    const officeTasks = await OfficeTask.find({ project: projectId });
    const siteTasks = await SiteTask.find({ project: projectId });

    let officeProgress = 0;
    if (officeTasks.length > 0) {
      const completed = officeTasks.filter(t => t.status === "Completed").length;
      officeProgress = (completed / officeTasks.length) * 100;
    }

    let siteProgress = 0;
    if (siteTasks.length > 0) {
      const completed = siteTasks.filter(t => t.status === "Completed").length;
      siteProgress = (completed / siteTasks.length) * 100;
    }

    const totalProgress = Math.round((officeProgress * 0.5) + (siteProgress * 0.5));

    let newStatus = "Planned";
    if (totalProgress === 100) {
      newStatus = "Completed";
    } else if (totalProgress > 0) {
      newStatus = "In Progress";
    }

    await Project.findByIdAndUpdate(projectId, {
      progress: totalProgress,
      status: newStatus,
    });
  } catch (error) {
    console.error("Error recalculating project progress:", error);
  }
};

module.exports = { recalculateProjectProgress };
