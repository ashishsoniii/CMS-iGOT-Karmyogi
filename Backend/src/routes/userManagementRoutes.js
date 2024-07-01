const express = require("express");
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");
const bcrypt = require("bcrypt");

const router = express.Router();

// Get All Users - depending on user's role
router.get("/users", authMiddleware(["super admin", "admin"]), async (req, res) => {
  try {
    let users;
    if (req.user.role === "super admin") {
      users = await User.find().select("-password"); // Super admin sees all users
    } else if (req.user.role === "admin") {
      users = await User.find({ role: { $in: ["editor"] } }).select("-password"); // Admin sees just editors
    } else {
      users = []; // Editors see no users
    }
    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get User by ID
router.get("/users/:id", authMiddleware(["super admin", "admin"]), async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password"); // Exclude the password field
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete User by ID
router.delete("/users/:id", authMiddleware(["super admin", "admin"]), async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update User by ID
router.put("/users/:id", authMiddleware(["super admin", "admin"]), async (req, res) => {
  const { name, email, phone, role } = req.body;

  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update user fields
    if (name) user.name = name;
    if (email) user.email = email;
    if (phone) user.phone = phone;
    if (role) user.role = role;

    // Save the updated user
    await user.save();

    res.status(200).json({ message: "User updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update User Password by only Super Admin
router.put(
  "/users/:id/password",
  authMiddleware(["super admin"]),
  async (req, res) => {
    const { password } = req.body;

    // Check if the password is provided
    if (!password) {
      return res.status(400).json({ message: "Password is required" });
    }

    try {
      // Find the user by ID
      const user = await User.findById(req.params.id);

      // If user not found, return error
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Hash the new password
      const saltRounds = 10;
      user.password = await bcrypt.hash(password, saltRounds);

      // Save the updated user
      await user.save();

      res.status(200).json({ message: "User password updated successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

// Activate User by ID
router.put(
  "/users/:id/activate",
  authMiddleware(["super admin", "admin"]),
  async (req, res) => {
    try {
      const user = await User.findById(req.params.id);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      user.status = "active";

      await user.save();

      res.status(200).json({ message: "User activated successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

// Deactivate User by ID
router.put(
  "/users/:id/deactivate",
  authMiddleware(["super admin", "admin"]),
  async (req, res) => {
    try {
      const user = await User.findById(req.params.id);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      user.status = "deactive";

      await user.save();

      res.status(200).json({ message: "User deactivated successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

module.exports = router;
