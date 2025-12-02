const express = require("express");
const router = express.Router();
const Timetable = require("../models/Timetable");

// get one student's weekly timetable
router.get("/:studentId", async (req, res) => {
  try {
    const data = await Timetable.find({ studentId: req.params.studentId });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Error loading timetable" });
  }
});

module.exports = router;
