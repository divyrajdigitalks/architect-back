const express = require("express");
const router = express.Router();
const { getSiteTasks, getSiteTask, createSiteTask, updateSiteTask, deleteSiteTask, uploadSiteTaskImages, deleteSiteTaskImage } = require("../controllers/siteTaskController");
const { protect } = require("../middleware/auth");
const upload = require("../middleware/upload");

router.use(protect);
router.route("/").get(getSiteTasks).post(createSiteTask);
router.route("/:id").get(getSiteTask).put(updateSiteTask).delete(deleteSiteTask);
router.post("/:id/upload", upload.array("images"), uploadSiteTaskImages);
router.delete("/:id/image", deleteSiteTaskImage);

module.exports = router;
