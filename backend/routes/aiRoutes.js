const express = require("express");
const router = express.Router();
const User = require("../models/user");
const { analyzeStudent } = require("../helpers/aiEngine");

router.get("/:studentId", async (req, res) => {
  try {
    const student = await User.findById(req.params.studentId);

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const result = analyzeStudent(student);

    res.json(result);
  } catch (err) {
    console.error("AI Analysis Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
