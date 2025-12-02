const express = require("express");
const router = express.Router();
const User = require("../models/user");
const calculateRisk = require("../utils/riskCalculator");
const generateAIReport = require("../helpers/localAI");


// ----------------------------------------------------
// GET PARENT DASHBOARD DATA
// ----------------------------------------------------
router.get("/dashboard/:parentId", async (req, res) => {
  try {
    const parent = await User.findById(req.params.parentId);

    if (!parent) {
      return res.status(404).json({ message: "Parent not found" });
    }

    if (!parent.childStudentId) {
      return res
        .status(400)
        .json({ message: "Parent has no linked child student" });
    }

    const child = await User.findById(parent.childStudentId);

    if (!child) {
      return res
        .status(404)
        .json({ message: "Child student not found for this parent" });
    }

    res.json({
      childName: child.name,
      attendance: child.attendance,
      behavior: child.behavior,
      knowledge: child.knowledge,
      assignmentsDue: child.assignmentsDue,
      risk: child.risk,
      riskReasons: child.riskReasons || [],
    });
  } catch (err) {
    console.error("Parent /dashboard error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

// ----------------------------------------------------
// GET PARENT AI INSIGHTS
// ----------------------------------------------------
router.get("/ai/:parentId", async (req, res) => {
  try {
    const parent = await User.findById(req.params.parentId);

    if (!parent || !parent.childStudentId) {
      return res.status(400).json({ message: "Invalid parent or no child" });
    }

    const child = await User.findById(parent.childStudentId);

    if (!child) {
      return res.status(404).json({ message: "Child student not found" });
    }

    // Recalculate risk using your backend algorithm
    const data = {
      attendance: child.attendance,
      behavior: child.behavior,
      knowledge: child.knowledge,
      assignmentsDue: child.assignmentsDue,
    };

    const riskResult = calculateRisk(data);

    res.json({
      riskLevel: riskResult.riskBand,
      riskScore: riskResult.overallScore,
      reasons: riskResult.reasons,
      academicRisk:
        child.knowledge < 60 ? "Low subject understanding" : "Stable",
      attendanceRisk:
        child.attendance < 60 ? "Irregular student attendance" : "Acceptable",
      behaviorRisk:
        child.behavior < 60 ? "Class involvement issues" : "Good behavior",

      suddenDrop: false, // You can enable this later
      weakTopics: [],
      recommendations: [
        "Encourage regular study habits",
        "Monitor assignment deadlines",
        "Reduce distractions during study time",
      ],
    });
  } catch (err) {
    console.error("Parent AI error:", err);
    return res.status(500).json({ message: "Parent AI server error" });
  }
});

// ----------------------------------------------------
// 🔥 GET PARENT DASHBOARD DATA (child + academic info)
// ----------------------------------------------------
router.get("/dashboard/:parentId", async (req, res) => {
  try {
    const parent = await User.findById(req.params.parentId);

    if (!parent || parent.role !== "parent") {
      return res.status(400).json({ message: "Invalid parent ID" });
    }

    if (!parent.childStudentId) {
      return res.status(404).json({ message: "Student not linked to parent" });
    }

    const child = await User.findById(parent.childStudentId).select(
      "name attendance behavior knowledge assignmentsDue risk riskReasons"
    );

    if (!child) {
      return res.status(404).json({ message: "Child record not found" });
    }

    res.json({
      childName: child.name,
      attendance: child.attendance,
      behavior: child.behavior,
      knowledge: child.knowledge,
      assignmentsDue: child.assignmentsDue,
      risk: child.risk,
      riskReasons: child.riskReasons,
    });

  } catch (err) {
    console.error("Parent dashboard error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ----------------------------------------------------
// 🔥 SIMPLE AI STUB FOR PARENT DASHBOARD
// (We will upgrade this in Step 2)
// ----------------------------------------------------
// router.get("/ai/:parentId", async (req, res) => {
//   try {
//     const parent = await User.findById(req.params.parentId);

//     if (!parent.childStudentId) {
//       return res.status(404).json({ message: "Student not linked to parent" });
//     }

//     const child = await User.findById(parent.childStudentId);

//     // TEMPORARY AI LOGIC (will upgrade later)
//     const aiReport = {
//       riskLevel: child.risk,
//       riskScore: child.riskScore || 0,
//       academicRisk: child.knowledge < 60 ? "Weak" : "Stable",
//       attendanceRisk: child.attendance < 75 ? "Concerning" : "Good",
//       behaviorRisk: child.behavior < 60 ? "Needs improvement" : "Positive",
//       weakTopics: [],
//       suddenDrop: false,
//       dropAmount: null,
//       reasons: child.riskReasons || ["Performance below threshold"],
//       recommendations: [
//         "Encourage consistent study schedule",
//         "Review assignments together",
//         "Schedule weekly revision"
//       ]
//     };

//     res.json(aiReport);

//   } catch (err) {
//     console.error("AI analysis error:", err);
//     res.status(500).json({ message: "AI processing failed" });
//   }
// });

router.get("/ai/:parentId", async (req, res) => {
  try {
    const parent = await User.findById(req.params.parentId);
    if (!parent || parent.role !== "parent")
      return res.status(404).json({ message: "Parent not found" });

    const student = await User.findById(parent.childStudentId);
    if (!student)
      return res.status(404).json({ message: "Child student not found" });

    const aiReport = generateAIReport(student);
    res.json(aiReport);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "AI error" });
  }
});

// ----------------------------------------------------
// GET Parent Dashboard Data
// ----------------------------------------------------
router.get("/dashboard/:parentId", async (req, res) => {
  try {
    const parent = await User.findById(req.params.parentId);

    if (!parent || parent.role !== "parent") {
      return res.status(400).json({ message: "Invalid parent ID" });
    }

    if (!parent.childStudentId) {
      return res.status(404).json({ message: "Student not linked to parent" });
    }

    const child = await User.findById(parent.childStudentId).select(
      "name attendance behavior knowledge assignmentsDue risk marks cgpaHistory riskReasons"
    );

    if (!child) {
      return res.status(404).json({ message: "Child record not found" });
    }

    res.json({
      childName: child.name,
      attendance: child.attendance,
      behavior: child.behavior,
      knowledge: child.knowledge,
      assignmentsDue: child.assignmentsDue,
      risk: child.risk,
      marks: child.marks,
      cgpaHistory: child.cgpaHistory,
      riskReasons: child.riskReasons
    });

  } catch (err) {
    console.error("Parent dashboard error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ----------------------------------------------------
// Parent AI Report
// ----------------------------------------------------
router.get("/ai/:parentId", async (req, res) => {
  try {
    const parent = await User.findById(req.params.parentId);
    if (!parent) return res.status(404).json({ message: "Parent not found" });

    const child = await User.findById(parent.childStudentId);
    if (!child) return res.status(404).json({ message: "Child not found" });

    const aiReport = {
      riskLevel: child.risk,
      riskScore: child.riskScore || 0,
      academicRisk:
        child.knowledge < 60 ? "Weak" : child.knowledge < 75 ? "Moderate" : "Strong",
      attendanceRisk:
        child.attendance < 60 ? "Critical" : child.attendance < 75 ? "Concerning" : "Stable",
      behaviorRisk:
        child.behavior < 60 ? "Needs Improvement" : "Positive",
      suddenDrop: false,
      weakTopics: [],
      reasons: child.riskReasons || ["Overall performance indicators"],
      recommendations: [
        "Focus on weak academic areas",
        "Improve attendance",
        "Daily revision for 30 minutes",
      ],
    };

    res.json(aiReport);

  } catch (err) {
    console.error("Parent AI error:", err);
    res.status(500).json({ message: "AI processing error" });
  }
});

module.exports = router;
