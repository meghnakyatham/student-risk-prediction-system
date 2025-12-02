const express = require("express");
const router = express.Router();

const LectureAttendance = require("../models/LectureAttendance");
const User = require("../models/user");
const lectureSchedule = require("../helpers/lectureSchedule");

router.get("/schedule", (req, res) => {
  res.json(lectureSchedule);
});


// -------------------------------------------------------------
// 🟣 MARK LECTURE-WISE ATTENDANCE FOR ONE STUDENT
// -------------------------------------------------------------
router.post("/mark", async (req, res) => {
  try {
    const { studentId, date, lectures } = req.body;

    if (!studentId || !date || !lectures) {
      return res.status(400).json({ message: "Missing fields" });
    }

    // Remove old record for the same date to prevent duplicates
    await LectureAttendance.deleteOne({ studentId, date });

    // Create new attendance record
    const record = await LectureAttendance.create({
      studentId,
      date,
      lectures,
    });

    // ---------------------------------------------------------
    // RECALCULATE OVERALL ATTENDANCE %
    // ---------------------------------------------------------
    const allRecords = await LectureAttendance.find({ studentId });

    const allLectures = allRecords.flatMap((r) => r.lectures);

    const total = allLectures.length;
    const present = allLectures.filter((l) => l.status === "Present").length;

    const attendancePercent = total === 0 ? 0 : Math.round((present / total) * 100);

    // Update student's attendance field
    await User.findByIdAndUpdate(studentId, {
      attendance: attendancePercent,
    });

    return res.json({
      message: "Attendance updated successfully",
      record,
      updatedAttendance: attendancePercent,
    });
  } catch (err) {
    console.error("Attendance error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// -------------------------------------------------------------
// 🟣 GET WEEKLY / MONTHLY LECTURE ATTENDANCE FOR A STUDENT
// -------------------------------------------------------------
router.get("/:studentId", async (req, res) => {
  try {
    const { studentId } = req.params;

    const records = await LectureAttendance.find({ studentId })
      .sort({ date: 1 })
      .lean();

    res.json(records);
  } catch (err) {
    console.error("Fetch error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// -------------------------------------------------------------
// 🟣 GET LECTURE ATTENDANCE FOR A SPECIFIC DATE
// -------------------------------------------------------------
router.get("/:studentId/:date", async (req, res) => {
  try {
    const { studentId, date } = req.params;

    const record = await LectureAttendance.findOne({ studentId, date });

    if (!record) {
      return res.status(404).json({ message: "No attendance found" });
    }

    res.json(record);
  } catch (err) {
    console.error("Fetch single day error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get monthly lecture attendance for a student
router.get("/month/:studentId/:year/:month", async (req, res) => {
  try {
    const { studentId, year, month } = req.params;

    const records = await LectureAttendance.find({
      studentId,
      date: {
        $regex: `^${year}-${month.padStart(2, "0")}`,
      },
    });

    res.json(records);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Monthly fetch error" });
  }
});


module.exports = router;
