const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Assignment = require("../models/Assignment");
const Attendance = require("../models/Attendance");
const Comment = require("../models/Comment");
const calculateRisk = require("../utils/riskCalculator");

// ----------------------------------------------------
// 📌 ADD COMMENT TO STUDENT
// ----------------------------------------------------
router.post("/:id/comment", async (req, res) => {
  try {
    const { text, teacherName } = req.body;

    const student = await User.findById(req.params.id);

    if (!student) return res.status(404).json({ message: "Student not found" });

    student.comments.push(`${teacherName}: ${text}`);
    await student.save();

    res.json({ message: "Comment added", student });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error adding comment" });
  }
});

// ----------------------------------------------------
// 📌 TEACHER UPDATES STUDENT PERFORMANCE (AUTO-RISK)
// ----------------------------------------------------
router.put("/:id/update", async (req, res) => {
  try {
    const {
      attendance,
      behavior,
      knowledge,
      assignmentsDue,
      counselingRequired,
    } = req.body;

    let student = await User.findById(req.params.id);

    if (!student) return res.status(404).json({ message: "Student not found" });

    // Update fields
    student.attendance = attendance;
    student.behavior = behavior;
    student.knowledge = knowledge;
    student.assignmentsDue = assignmentsDue;
    student.counselingRequired = counselingRequired;

    // Recalculate risk
    const riskResult = calculateRisk({
      attendance,
      behavior,
      knowledge,
      assignmentsDue,
    });

    student.risk = riskResult.riskBand;
    student.riskScore = riskResult.overallScore;
    student.riskReasons = riskResult.reasons;

    await student.save();

    res.json({
      message: "Student updated successfully",
      student,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating student" });
  }
});

// ----------------------------------------------------
// 📌 CREATE ASSIGNMENT
// ----------------------------------------------------
router.post("/assignment", async (req, res) => {
  try {
    const { title, description, dueDate, subject, uploadedBy } = req.body;

    const assignment = new Assignment({
      title,
      description,
      dueDate,
      subject,
      uploadedBy,
    });

    await assignment.save();
    res.json({ message: "Assignment created", assignment });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating assignment" });
  }
});

// ----------------------------------------------------
// 📌 MARK ATTENDANCE
// ----------------------------------------------------
router.post("/attendance", async (req, res) => {
  try {
    const { studentId, status, subject } = req.body;

    const attendance = new Attendance({
      student: studentId,
      status,
      subject,
    });

    await attendance.save();
    res.json({ message: "Attendance marked", attendance });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error marking attendance" });
  }
});

// ----------------------------------------------------
// 📌 TEACHER GET ALL STUDENTS (with backend risk)
// ----------------------------------------------------
router.get("/students", async (req, res) => {
  try {
    const students = await User.find({ role: "student" });

    const enriched = students.map((student) => {
      const riskResult = calculateRisk({
        attendance: student.attendance,
        behavior: student.behavior,
        knowledge: student.knowledge,
        assignmentsDue: student.assignmentsDue,
      });

      return {
        ...student.toObject(),
        risk: riskResult.riskBand,
        riskScore: riskResult.overallScore,
        riskReasons: riskResult.reasons,
      };
    });

    res.json(enriched);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching students" });
  }
});

const { analyzeStudent } = require("../helpers/aiEngine");

// ⭐ AI SUMMARY FOR ALL STUDENTS
router.get("/ai-summary/all", async (req, res) => {
  try {
    const students = await User.find({ role: "student" });

    const aiSummaries = students.map((s) => {
      const analysis = analyzeStudent(s);

      return {
        _id: s._id,
        name: s.name,
        email: s.email,

        // quick overview for teacher list page
        academicRisk: analysis.academicRisk,
        attendanceRisk: analysis.attendanceRisk,
        behaviorRisk: analysis.behaviorRisk,
        overallRisk: analysis.riskLevel,
        riskScore: analysis.riskScore,
      };
    });

    res.json(aiSummaries);
  } catch (err) {
    console.error("Teacher AI Summary Error", err);
    res.status(500).json({ message: "AI summary error" });
  }
});

// ⭐ FULL AI ANALYSIS FOR ONE STUDENT
router.get("/ai/:studentId", async (req, res) => {
  try {
    const student = await User.findById(req.params.studentId);

    if (!student)
      return res.status(404).json({ message: "Student not found" });

    const analysis = analyzeStudent(student);
    res.json(analysis);
  } catch (err) {
    console.error("Teacher AI Detail Error", err);
    res.status(500).json({ message: "AI detail error" });
  }
});


module.exports = router;
