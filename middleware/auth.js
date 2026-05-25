const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password").populate("role");
      next();
    } catch {
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  }
  if (!token) return res.status(401).json({ message: "Not authorized, no token" });
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(403).json({ message: "No role assigned" });
    }
    // Check if role name matches (for backward compatibility or specific role checks)
    if (!roles.includes(req.user.role.name)) {
      return res.status(403).json({ message: `Role '${req.user.role.name}' is not authorized` });
    }
    next();
  };
};

const hasPermission = (permission) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(403).json({ message: "No role assigned" });
    }
    const userPermissions = req.user.role.permissions || [];
    const hasAll = userPermissions.includes("all");
    const roleName = req.user.role.name.toLowerCase();

    if (!hasAll && !userPermissions.includes(permission) && roleName !== "admin") {
      return res.status(403).json({ message: `Permission '${permission}' required` });
    }
    next();
  };
};

module.exports = { protect, authorize, hasPermission };
