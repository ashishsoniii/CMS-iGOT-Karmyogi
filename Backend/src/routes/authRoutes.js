const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const superAdminAuthMiddleware = require("../middleware/authMiddleware");

const router = express.Router();
const secretKey = "admin123"; // Enter a secure secret key

// Super Admin Registration
router.post("/addSuperAdmin", async (req, res) => {
  const { name, email, phone, password } = req.body;

  // Checking if all required fields are provided
  if (!name || !email || !phone || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Checking if the provided email is already registered
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User with this email already exists" });
    }

    // Hashing the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create a new super admin user
    const newUser = new User({
      name,
      email,
      phone,
      password: hashedPassword,
      role: "super admin",
    });

    await newUser.save();

    // Generate JWT token
    const token = jwt.sign(
      { email: newUser.email, role: newUser.role },
      secretKey,
      { expiresIn: "1w" }
    );

    res
      .status(201)
      .json({ message: "Super admin registered successfully", token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// User Registration (only accessible by super admins)
router.post("/addNewUser", superAdminAuthMiddleware, async (req, res) => {
  const { name, email, phone, password, role } = req.body;

  // Check if all required fields are provided
  if (!name || !email || !phone || !password || !role ) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Check if the provided email is already registered
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User with this email already exists" });
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create a new user
    const newUser = new User({
      name,
      email,
      phone,
      password: hashedPassword,
      role,
    });

    await newUser.save();

    // Generating JWT token
    const token = jwt.sign(
      { email: newUser.email, role: newUser.role },
      secretKey,
      { expiresIn: "1w" }
    );

    res.status(201).json({ message: "User registered successfully", token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
