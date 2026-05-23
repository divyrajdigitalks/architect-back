const Payment = require("../models/Payment");

const getPayments = async (req, res) => {
  try {
    const { project, client } = req.query;
    const filter = {};
    if (project) filter.project = project;
    if (client) filter.client = client;
    const payments = await Payment.find(filter)
      .populate("project", "name")
      .populate("client", "name");
    res.json(payments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getPayment = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate("project", "name")
      .populate("client", "name email");
    if (!payment) return res.status(404).json({ message: "Payment not found" });
    res.json(payment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createPayment = async (req, res) => {
  try {
    const payment = await Payment.create(req.body);
    res.status(201).json(payment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const updatePayment = async (req, res) => {
  try {
    const payment = await Payment.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!payment) return res.status(404).json({ message: "Payment not found" });
    res.json(payment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const deletePayment = async (req, res) => {
  try {
    const payment = await Payment.findByIdAndDelete(req.params.id);
    if (!payment) return res.status(404).json({ message: "Payment not found" });
    res.json({ message: "Payment deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getPayments, getPayment, createPayment, updatePayment, deletePayment };
