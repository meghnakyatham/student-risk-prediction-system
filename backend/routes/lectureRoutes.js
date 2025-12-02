const express = require("express");
const router = express.Router();
const Lecture = require("../models/lecture");  // You will create this model below

// Fetch lecture attendance for a student for any month
router.get("/month/:studentId/:year/:month", async (req, res) => {
  try {
    const { studentId, year, month } = req.params;

    const start = `${year}-${month.padStart(2, "0")}-01`;
    const end = `${year}-${month.padStart(2, "0")}-31`;

    const records = await Lecture.find({
      studentId,
      date: { $gte: start, $lte: end }
    });

    res.json(records);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
