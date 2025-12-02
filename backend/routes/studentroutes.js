const express = require("express");
const router = express.Router();
const User = require("../models/user");
const calculateRisk = require("../utils/riskCalculator");
const generateAIReport = require("../helpers/localAI");


router.post("/seed-student", async (req, res) => {
  try {
    const email = "student41@school.com";

    const student = await User.findOneAndUpdate(
      { email },
      {
        attendance: 72,
        behavior: 65,
        knowledge: 78,
        assignmentsDue: 2,
        risk: "Medium",
        comments: ["Keep improving attendance!", "Good progress in academics."],
      },
      { new: true }
    );

    res.json(student);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Seed error" });
  }
});


// -------------------------------------------
// 🔥 TEMP SEED ROUTES (leave as is)
// -------------------------------------------

// TEMP #2: Seed performance data (CGPA + Marks)
router.get("/seed-performance", async (req, res) => {
  try {
    const email = "student41@school.com"; 

    const student = await User.findOneAndUpdate(
      { email },
      {
        marks: [
          { subject: "Math", score: 78 },
          { subject: "Science", score: 85 },
          { subject: "English", score: 88 },
          { subject: "Computer Science", score: 92 },
        ],
        cgpaHistory: [
          { semester: "Sem 1", cgpa: 7.4 },
          { semester: "Sem 2", cgpa: 7.8 },
          { semester: "Sem 3", cgpa: 8.2 },
          { semester: "Sem 4", cgpa: 8.5 },
        ],
      },
      { new: true }
    );

    if (!student) {
      return res.status(404).json({ message: "Student not found with that email" });
    }

    res.json(student);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Seed performance error" });
  }
});


// -------------------------------------------
// 📌 MAIN ROUTES START BELOW
// -------------------------------------------


// ✅ GET ALL STUDENTS (with calculated risk)
router.get("/", async (req, res) => {
  try {
    const students = await User.find({ role: "student" }).select(
      "name email attendance behavior knowledge assignmentsDue comments counselingRequired"
    );

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
    res.status(500).json({ message: "Server error" });
  }
});


// ✅ GET ONE STUDENT BY ID (with calculated risk)
router.get("/:id", async (req, res) => {
  try {
    const student = await User.findById(req.params.id).select(
      "name email attendance behavior knowledge assignmentsDue comments counselingRequired"
    );

    if (!student) return res.status(404).json({ message: "Student not found" });

    const riskResult = calculateRisk({
      attendance: student.attendance,
      behavior: student.behavior,
      knowledge: student.knowledge,
      assignmentsDue: student.assignmentsDue,
    });

    const responseData = {
      ...student.toObject(),
      risk: riskResult.riskBand,
      riskScore: riskResult.overallScore,
      riskReasons: riskResult.reasons,
    };

    res.json(responseData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/ai/:studentId", async (req, res) => {
  try {
    const student = await User.findById(req.params.studentId);
    if (!student)
      return res.status(404).json({ message: "Student not found" });

    const aiReport = generateAIReport(student);
    res.json(aiReport);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "AI error" });
  }
});



// ✅ UPDATE STUDENT (auto recalculates risk)
router.put("/:id", async (req, res) => {
  try {
    const {
      attendance,
      behavior,
      knowledge,
      assignmentsDue,
      comments,
      counselingRequired,
    } = req.body;

    // First update the student fields
    let student = await User.findByIdAndUpdate(
      req.params.id,
      {
        attendance,
        behavior,
        knowledge,
        assignmentsDue,
        comments,
        counselingRequired,
      },
      { new: true }
    );

    if (!student) return res.status(404).json({ message: "Student not found" });

    // Recalculate risk using unified calculator
    const riskResult = calculateRisk({
      attendance: student.attendance,
      behavior: student.behavior,
      knowledge: student.knowledge,
      assignmentsDue: student.assignmentsDue,
    });

    // Save new risk directly into DB
    student.risk = riskResult.riskBand;
    student.riskScore = riskResult.overallScore;
    student.riskReasons = riskResult.reasons;

    await student.save();

    // Return updated student with risk
    const responseData = {
      ...student.toObject(),
      risk: riskResult.riskBand,
      riskScore: riskResult.overallScore,
      riskReasons: riskResult.reasons,
    };

    res.json(responseData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});


// ✅ Get performance data for one student
router.get("/:id/performance", async (req, res) => {
  try {
    const student = await User.findById(req.params.id).select(
      "name marks cgpaHistory"
    );

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.json(student);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});



module.exports = router;
