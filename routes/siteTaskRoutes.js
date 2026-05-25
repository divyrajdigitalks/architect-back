const express = require("express");
const router = express.Router();
const { getSiteTasks, getSiteTask, createSiteTask, updateSiteTask, deleteSiteTask } = require("../controllers/siteTaskController");
const { protect } = require("../middleware/auth");

router.use(protect);
router.route("/").get(getSiteTasks).post(createSiteTask);
router.route("/:id").get(getSiteTask).put(updateSiteTask).delete(deleteSiteTask);

module.exports = router;
