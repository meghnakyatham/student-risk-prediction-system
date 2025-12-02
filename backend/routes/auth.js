const express = require("express");
const router = express.Router();
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// ---------------------------------------
// REGISTER
// ---------------------------------------
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    let existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      role,
    });

    await user.save();

    res.json({ message: "User registered successfully", user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ---------------------------------------
// LOGIN
// ---------------------------------------
router.post("/login", async (req, res) => {
  try {
    const { email, password, role } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Invalid email or password" });

    if (user.role !== role)
      return res.status(403).json({ message: "Role mismatch" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid email or password" });

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // 🔥 CRITICAL FIX: RETURN USER._id HERE
    return res.json({
      message: "Login successful",
      user: {
        _id: user._id, // ⭐ REQUIRED FOR ALL FRONTEND ROUTES
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token: token,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
