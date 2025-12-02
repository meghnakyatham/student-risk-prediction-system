const express = require('express');
const router = express.Router();

const StudentProfile = require('../models/StudentProfile');
const Attendance = require('../models/Attendance');
const Assignment = require('../models/Assignment');
const Comment = require('../models/Comment');

const calculateRisk = require('../utils/riskCalculator');
const auth = require('../middleware/auth');

// TEMPORARY ROUTE TO CREATE STUDENT PROFILE
router.post('/create-profile', auth, async (req, res) => {
  try {
    const profile = new StudentProfile({
      user: req.body.userId,
      rollNumber: req.body.rollNumber,
      className: req.body.className,
      cgpa: req.body.cgpa || 0,
      subjects: req.body.subjects || []
    });

    await profile.save();
    res.json({ msg: "Student profile created", profile });

  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Server error" });
  }
});

// =============================
// STUDENT DASHBOARD
// =============================
router.get('/:id/dashboard', auth, async (req, res) => {
  try {
    const studentId = req.params.id;

    const profile = await StudentProfile.findById(studentId).populate("user");

    // Fetch attendance
    const attendanceRecords = await Attendance.find({ student: studentId });
    const total = attendanceRecords.length;
    const present = attendanceRecords.filter(a => a.present).length;
    const attendancePercent = total === 0 ? 100 : Math.round((present / total) * 100);

    // Fetch assignments submitted
    const assignments = await Assignment.find({
      "submissions.student": studentId
    });

    // Find missing assignments
    const missingAssignments = await Assignment.countDocuments({
      "submissions.student": { $ne: studentId }
    });

    const comments = await Comment.find({ student: studentId })
      .populate("teacher");

    // RISK SCORE
    const risk = calculateRisk({
      attendancePercent,
      missingAssignments
    });

    res.json({
      profile,
      attendancePercent,
      assignments,
      missingAssignments,
      comments,
      risk
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
