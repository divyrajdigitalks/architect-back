const express = require("express");
const router = express.Router();
const { getMessages, sendMessage, markRead, deleteMessage } = require("../controllers/messageController");
const { protect } = require("../middleware/auth");

router.use(protect);
router.route("/").get(getMessages).post(sendMessage);
router.patch("/mark-read", markRead);
router.delete("/:id", deleteMessage);

module.exports = router;
