const Message = require("../models/Message");

const getMessages = async (req, res) => {
  try {
    const { project } = req.query;
    const filter = {
      $or: [{ from: req.user._id }, { to: req.user._id }],
    };
    if (project) filter.project = project;
    const messages = await Message.find(filter)
      .populate("from", "name role")
      .populate("to", "name role")
      .sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const sendMessage = async (req, res) => {
  try {
    const message = await Message.create({ ...req.body, from: req.user._id });
    res.status(201).json(message);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const markRead = async (req, res) => {
  try {
    await Message.updateMany({ to: req.user._id, unread: true }, { unread: false });
    res.json({ message: "Messages marked as read" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteMessage = async (req, res) => {
  try {
    const msg = await Message.findByIdAndDelete(req.params.id);
    if (!msg) return res.status(404).json({ message: "Message not found" });
    res.json({ message: "Message deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getMessages, sendMessage, markRead, deleteMessage };
