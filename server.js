const path = require("path");
require("dotenv").config();
const express = require("express");
const cors = require("cors");
require('node:dns').setServers(['1.1.1.1', '8.8.8.8'])

const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorHandler");

// Routes
const authRoutes = require("./routes/authRoutes");
const projectRoutes = require("./routes/projectRoutes");
const clientRoutes = require("./routes/clientRoutes");
const userRoutes = require("./routes/userRoutes");
const roleRoutes = require("./routes/roleRoutes");
const taskRoutes = require("./routes/taskRoutes");
const officeTaskRoutes = require("./routes/officeTaskRoutes");
const siteTaskRoutes = require("./routes/siteTaskRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const siteUpdateRoutes = require("./routes/siteUpdateRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");
const messageRoutes = require("./routes/messageRoutes");
const sitePhotoRoutes = require("./routes/sitePhotoRoutes");

connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/clients", clientRoutes);
app.use("/api/users", userRoutes);
app.use("/api/roles", roleRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/office-tasks", officeTaskRoutes);
app.use("/api/site-tasks", siteTaskRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/site-updates", siteUpdateRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/site-photos", sitePhotoRoutes);

app.get("/", (req, res) => res.json({ message: "Architect Backend API Running" }));

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
