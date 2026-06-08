const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const User = require("../models/User");
const sendEmail = require("../utils/sendEmail");

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

// POST /api/auth/register
const register = async (req, res) => {
  try {
    const { name, email, password, role, phone, address, specializations, team, rate, joinDate, experience } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "User already exists" });

    const user = await User.create({ name, email, password, role, phone, address, specializations, team, rate, joinDate, experience });
    const populatedUser = await user.populate("role");
    res.status(201).json({
      _id: populatedUser._id,
      name: populatedUser.name,
      email: populatedUser.email,
      role: populatedUser.role.name,
      team: populatedUser.team,
      trackAttendance: populatedUser.trackAttendance,
      config: populatedUser.config,
      token: generateToken(populatedUser._id),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).populate("role");
    if (!user || !(await user.matchPassword(password)))
      return res.status(401).json({ message: "Invalid email or password" });

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role.name,
      team: user.team,
      trackAttendance: user.trackAttendance,
      config: user.config,
      token: generateToken(user._id),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/auth/me
const getMe = async (req, res) => {
  res.json(req.user);
};

// POST /api/auth/forgot-password
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Please provide an email" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found with this email" });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(20).toString("hex");

    // Hash token and set to resetPasswordToken field
    user.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // Set expire (1 hour)
    user.resetPasswordExpire = Date.now() + 3600000;

    await user.save();

    // Create reset url
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
    const resetUrl = `${frontendUrl}/reset-password?token=${resetToken}`;

    const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please click the link below to reset your password:\n\n ${resetUrl}`;

    try {
      await sendEmail({
        email: user.email,
        subject: "Password reset token",
        message
      });

      res.status(200).json({ message: "Email sent successfully" });
    } catch (err) {
      console.log("--- PASSWORD RESET LINK FOR TESTING ---");
      console.log("Reset URL:", resetUrl);
      console.log("---------------------------------------");
      
      res.status(200).json({ 
        message: "Password reset initiated. (Note: Email failed to send, check backend console logs for the reset link)",
        resetUrlForTesting: resetUrl 
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/auth/reset-password
const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;
    if (!token || !password) {
      return res.status(400).json({ message: "Token and new password are required" });
    }

    // Hash token to match with the database
    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    // Set new password (this will be encrypted by the pre('save') hook or manually if we do it here)
    // Wait, in User.js we have a pre('save') hook:
    // userSchema.pre("save", async function (next) {
    //   if (!this.isModified("password")) return next();
    //   this.password = CryptoJS.AES.encrypt(this.password, SECRET_KEY).toString();
    //   next();
    // });
    // So we just set it here directly!
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { register, login, getMe, forgotPassword, resetPassword };
