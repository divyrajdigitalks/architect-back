const mongoose = require("mongoose");
require('node:dns').setServers(['1.1.1.1','8.8.8.8']);
const OfficeTask = require("../models/OfficeTask");
const SiteTask = require("../models/SiteTask");
require("dotenv").config({ path: "../.env" }); // Load from root if possible, or assume it's run with connection string

const migrate = async () => {
  try {
    // We assume server.js exports the DB connection, or we can just connect here
    // Let's connect directly to local DB or ENV
    const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/architect";
    await mongoose.connect(uri);
    console.log("Connected to DB...");

    const officeTasks = await OfficeTask.find({});
    for (let task of officeTasks) {
      let progress = 0;
      if (task.status === "Completed") progress = 100;
      else if (task.status === "In Progress") progress = 50;
      task.progress = progress;
      await task.save();
    }
    console.log(`Updated ${officeTasks.length} office tasks.`);

    const siteTasks = await SiteTask.find({});
    for (let task of siteTasks) {
      let progress = 0;
      if (task.status === "Completed") progress = 100;
      else if (task.status === "In Progress" || task.status === "On Track") progress = 50;
      else if (task.status === "Critical" || task.status === "Delayed") progress = 25;
      task.progress = progress;
      await task.save();
    }
    console.log(`Updated ${siteTasks.length} site tasks.`);

    console.log("Migration finished.");
    process.exit(0);
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
};

migrate();
