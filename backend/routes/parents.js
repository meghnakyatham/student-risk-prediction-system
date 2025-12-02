const express = require('express');
const router = express.Router();

const User = require('../models/user');
const auth = require('../middleware/auth');
const StudentProfile = require('../models/StudentProfile');
const Attendance = require('../models/Attendance');
const Assignment = require('../models/Assignment');
const Comment = require('../models/Comment');

const calculateRisk = require('../utils/riskCalculator');

// TEMPORARY: link parent to student
router.post('/link', auth, async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user.id, {
      childStudentId: req.body.studentProfileId
    });
    res.json({ msg: "Parent linked to student" });
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
});


// Parent has a "childStudentId" in User model
router.get('/dashboard', auth, async (req, res) => {
  if (req.user.role !== 'parent') {
    return res.status(403).json({ msg: "Access denied" });
  }

  try {
    const parent = await User.findById(req.user.id);
    const studentId = parent.childStudentId;

    const profile = await StudentProfile.findById(studentId).populate("user");

    const attendance = await Attendance.find({ student: studentId });

    const total = attendance.length;
    const present = attendance.filter(a => a.present).length;
    const attendancePercent = total === 0 ? 100 : Math.round((present / total) * 100);

    const missingAssignments = await Assignment.countDocuments({
      "submissions.student": { $ne: studentId }
    });

    const comments = await Comment.find({ student: studentId }).populate("teacher");

    const risk = calculateRisk({
      attendancePercent,
      missingAssignments
    });

    res.json({ profile, attendancePercent, missingAssignments, comments, risk });
    
  } catch (error) {
    res.status(500).json({ msg: "Server Error" });
  }
});

module.exports = router;
