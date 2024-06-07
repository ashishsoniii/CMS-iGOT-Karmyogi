const jwt = require("jsonwebtoken");
const secretKey = "admin123";

const User = require("../models/User");

const superAdminAuthMiddleware = async (req, res, next) => {
  try {
    // Extracting token from the request headers
    const token = req.headers.authorization?.split(" ")[1]; // Bearer <token>

    // If token is not provided, return unauthorized status
    if (!token) {
      return res.status(401).json({ error: "Authorization token is required" });
    }

    // Verifying token
    const decoded = jwt.verify(token, secretKey);

    // Check if the decoded token contains a valid email and role
    if (!decoded.email ||!decoded.role ||!decoded.role.includes("super admin")) {
      return res.status(401).json({ error: "Invalid token or insufficient permissions" });
    }

    // Check if the admin exists
    const admin = await User.findOne({ email: decoded.email });
    if (!admin) {
      return res.status(401).json({ error: "User not found" });
    }

    // Attaching the admin object to the request for further use in routes
    req.admin = admin;

    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
};

module.exports = superAdminAuthMiddleware;
