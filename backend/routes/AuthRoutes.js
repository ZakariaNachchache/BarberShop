const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const router = express.Router();
const { createAdminUser } = require("../controllers/adminController");
const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

router.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const user = new User({ username, email, password });
    await user.save();

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1d" });
    res.status(201).json({ token, message: "Signup successful" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await user.comparePassword(password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1d" });
    res.status(200).json({ token, message: "Login successful" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/create-admin", createAdminUser);

router.post("/logout", (req, res) => {
  res.status(200).json({ message: "Logout successful" });
});

module.exports = router;
