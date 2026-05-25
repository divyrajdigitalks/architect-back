const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");
const Role = require("./models/Role");
require('node:dns').setServers(['1.1.1.1','8.8.8.8']);
require("dotenv").config();

const rolesData = [
  { 
    name: "director", 
    description: "Director with full access", 
    permissions: ["all"] 
  },
  { 
    name: "architect", 
    description: "Architect for project management", 
    permissions: [
      "dashboard.view", 
      "projects.view", "projects.create", "projects.edit", 
      "tasks.view", "tasks.create", "tasks.edit",
      "office-work.view", "office-work.create", "office-work.edit",
      "staff.view"
    ] 
  },
  { 
    name: "office-team", 
    description: "Office staff", 
    permissions: ["dashboard.view", "projects.view", "messages.view", "calendar.view"] 
  },
  { 
    name: "site-engineer", 
    description: "Engineer for site updates", 
    permissions: ["dashboard.view", "projects.view", "site-updates.view", "site-updates.create", "site-photos.view", "site-photos.create"] 
  },
  { 
    name: "supervisor", 
    description: "Site supervisor", 
    permissions: ["dashboard.view", "projects.view", "tasks.view", "site-updates.create"] 
  },
  { 
    name: "accountant", 
    description: "Finance and payments", 
    permissions: ["dashboard.view", "payments.view", "payments.create", "reports.view"] 
  },
  { 
    name: "client", 
    description: "Client view only", 
    permissions: ["dashboard.view", "projects.view", "payments.view", "site-updates.view"] 
  },
  { 
    name: "admin", 
    description: "System Administrator", 
    permissions: ["all"] 
  }
];

const usersData = [
  { name: "Director User", email: "director@gmail.com", password: "123456", roleName: "director", team: "Office" },
  { name: "Architect User", email: "architect@gmail.com", password: "123456", roleName: "architect", team: "Office" },
  { name: "Office User", email: "office@gmail.com", password: "123456", roleName: "office-team", team: "Office" },
  { name: "Engineer User", email: "engineer@gmail.com", password: "123456", roleName: "site-engineer", team: "Site" },
  { name: "Supervisor User", email: "supervisor@gmail.com", password: "123456", roleName: "supervisor", team: "Site" },
  { name: "Accountant User", email: "accountant@gmail.com", password: "123456", roleName: "accountant", team: "Office" },
  { name: "Client User", email: "client@gmail.com", password: "123456", roleName: "client", team: "Office" }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB...");

    // 1. Clear existing data
    await User.deleteMany({});
    await Role.deleteMany({});
    console.log("Cleared existing Users and Roles.");

    // 2. Insert Roles
    const createdRoles = await Role.insertMany(rolesData);
    console.log("Roles seeded.");

    // 3. Create a map of Role Name -> Role ID
    const roleMap = {};
    createdRoles.forEach(role => {
      roleMap[role.name] = role._id;
    });

    // 4. Prepare Users with Role IDs
    const usersToInsert = usersData.map(u => ({
      name: u.name,
      email: u.email,
      password: u.password, // User model should have pre-save hook for hashing
      role: roleMap[u.roleName],
      team: u.team,
      isActive: true
    }));

    // 5. Insert Users (using create to trigger pre-save password hashing)
    await User.create(usersToInsert);
    console.log("Users seeded successfully.");

    process.exit();
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

seedDB();
