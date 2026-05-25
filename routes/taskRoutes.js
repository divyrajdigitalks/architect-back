const express = require("express");
const router = express.Router();
const { getTasks } = require("../controllers/taskController");
const { protect } = require("../middleware/auth");

router.use(protect);
router.get("/", getTasks);

module.exports = router;
