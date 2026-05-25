const express = require("express");
const router = express.Router();
const { getOfficeTasks, getOfficeTask, createOfficeTask, updateOfficeTask, deleteOfficeTask } = require("../controllers/officeTaskController");
const { protect } = require("../middleware/auth");

router.use(protect);
router.route("/").get(getOfficeTasks).post(createOfficeTask);
router.route("/:id").get(getOfficeTask).put(updateOfficeTask).delete(deleteOfficeTask);

module.exports = router;
