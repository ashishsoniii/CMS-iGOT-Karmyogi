const jwt = require("jsonwebtoken");
const User = require("../models/User");

const secretKey = "admin123";

const authMiddleware = (requiredRoles) => {
  return async (req, res, next) => {
    try {
      const token = req.headers.authorization?.split(" ")[1]; // Bearer <token>

      if (!token) {
        return res.status(401).json({ error: "Authorization token is required" });
      }

      const decoded = jwt.verify(token, secretKey);

      if (!decoded.email || !decoded.role || !requiredRoles.includes(decoded.role)) {
        return res.status(401).json({ error: "Invalid token or insufficient permissions" });
      }

      const user = await User.findOne({ email: decoded.email });
      if (!user) {
        return res.status(401).json({ error: "User not found" });
      }

      req.user = user;
      next();
    } catch (error) {
      res.status(401).json({ error: "Invalid token" });
    }
  };
};

module.exports = authMiddleware;
