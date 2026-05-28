const express = require("express");
const router = express.Router();
const { getOfficeTasks, getOfficeTask, createOfficeTask, updateOfficeTask, deleteOfficeTask, uploadOfficeTaskImages, deleteOfficeTaskImage } = require("../controllers/officeTaskController");
const { protect } = require("../middleware/auth");
const upload = require("../middleware/upload");

router.use(protect);
router.route("/").get(getOfficeTasks).post(createOfficeTask);
router.route("/:id").get(getOfficeTask).put(updateOfficeTask).delete(deleteOfficeTask);
router.post("/:id/upload", upload.array("images"), uploadOfficeTaskImages);
router.delete("/:id/image", deleteOfficeTaskImage);

module.exports = router;
