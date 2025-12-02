const express = require('express');
const router = express.Router();

const StudentProfile = require('../models/StudentProfile');
const Attendance = require('../models/Attendance');
const Assignment = require('../models/Assignment');
const Comment = require('../models/Comment');

const auth = require('../middleware/auth');

// ONLY teachers can use these routes
function teacherOnly(req, res, next) {
  if (req.user.role !== 'teacher') {
    return res.status(403).json({ msg: "Access denied" });
  }
  next();
}

// =============================
// Add COMMENT for a student
// =============================
router.post('/:studentId/comment', auth, teacherOnly, async (req, res) => {
  try {
    const comment = new Comment({
      teacher: req.user.id,
      student: req.params.studentId,
      text: req.body.text
    });

    await comment.save();
    res.json({ msg: "Comment added", comment });

  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
});

// =============================
// Mark student for counseling
// =============================
router.post('/:studentId/counseling', auth, teacherOnly, async (req, res) => {
  try {
    await StudentProfile.findByIdAndUpdate(
      req.params.studentId,
      { needsCounseling: true }
    );

    res.json({ msg: "Student marked for counseling" });

  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
});

// =============================
// Add ATTENDANCE
// =============================
router.post('/:studentId/attendance', auth, teacherOnly, async (req, res) => {
  try {
    const attendance = new Attendance({
      student: req.params.studentId,
      subject: req.body.subject,
      date: new Date(),
      present: req.body.present
    });

    await attendance.save();
    res.json({ msg: "Attendance recorded" });

  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
});

// =============================
// Add ASSIGNMENT
// =============================
router.post('/assignment', auth, teacherOnly, async (req, res) => {
  try {
    const assignment = new Assignment({
      title: req.body.title,
      description: req.body.description,
      subject: req.body.subject,
      dueDate: req.body.dueDate,
      uploader: req.user.id
    });

    await assignment.save();
    res.json({ msg: "Assignment created", assignment });

  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
