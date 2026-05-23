const express = require("express");
const router = express.Router();
const { getAttendance, markAttendance, updateAttendance, deleteAttendance } = require("../controllers/attendanceController");
const { protect } = require("../middleware/auth");

router.use(protect);
router.route("/").get(getAttendance).post(markAttendance);
router.route("/:id").put(updateAttendance).delete(deleteAttendance);

module.exports = router;
