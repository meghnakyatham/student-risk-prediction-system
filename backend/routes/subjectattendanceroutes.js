const express = require("express");
const router = express.Router();
const SubjectAttendance = require("../models/SubjectAttendance");

// get all subjects attendance for a student
router.get("/:studentId", async (req, res) => {
  try {
    const data = await SubjectAttendance.find({ studentId: req.params.studentId });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Error loading attendance" });
  }
});

module.exports = router;
