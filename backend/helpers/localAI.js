// helpers/localAI.js

module.exports = function generateAIReport(student) {
  const {
    attendance = 0,
    behavior = 0,
    knowledge = 0,
    assignmentsDue = 0,
    marks = [],
    cgpaHistory = []
  } = student;

  // -----------------------------
  // 1️⃣ Compute Sub-Risks
  // -----------------------------

  const attendanceRisk =
    attendance < 60 ? "High" :
    attendance < 75 ? "Medium" :
    "Low";

  const behaviorRisk =
    behavior < 50 ? "High" :
    behavior < 70 ? "Medium" :
    "Low";

  const academicRisk =
    knowledge < 55 ? "High" :
    knowledge < 70 ? "Medium" :
    "Low";

  // -----------------------------
  // 2️⃣ Compute Overall Risk Score
  // -----------------------------
  const score =
    (attendance * 0.3) +
    (behavior * 0.2) +
    (knowledge * 0.3) +
    ((5 - assignmentsDue) * 10);

  let riskLevel =
    score < 50 ? "High" :
    score < 70 ? "Medium" :
    "Low";

  // -----------------------------
  // 3️⃣ Detect CGPA Drops
  // -----------------------------
  let suddenDrop = false;
  let dropAmount = 0;

  if (cgpaHistory.length >= 2) {
    const last = Number(cgpaHistory[cgpaHistory.length - 1].cgpa);
    const prev = Number(cgpaHistory[cgpaHistory.length - 2].cgpa);

    if (prev - last >= 1.0) {
      suddenDrop = true;
      dropAmount = (prev - last).toFixed(1);
    }
  }

  // -----------------------------
  // 4️⃣ Weak Topics Detection
  // -----------------------------
  const weakTopics = marks
    .filter((m) => m.score < 60)
    .map((m) => ({
      subject: m.subject,
      topics: ["Basics", "Core Concepts"] // simple placeholder
    }));

  // -----------------------------
  // 5️⃣ Reasons
  // -----------------------------
  const reasons = [];

  if (attendanceRisk !== "Low") reasons.push("Irregular attendance");
  if (behaviorRisk !== "Low") reasons.push("Behavior concerns observed");
  if (academicRisk !== "Low") reasons.push("Academic performance needs improvement");
  if (assignmentsDue > 2) reasons.push("Multiple pending assignments");
  if (suddenDrop) reasons.push("Sudden drop in CGPA detected");

  // -----------------------------
  // 6️⃣ Recommendations
  // -----------------------------
  const recommendations = [
    "Encourage regular attendance.",
    "Focus on daily revision.",
    "Help manage assignment deadlines.",
    "Monitor study habits.",
    "Offer support in weak subjects."
  ];

  // -----------------------------
  // 7️⃣ Final JSON Output
  // -----------------------------
  return {
    riskScore: Math.round(score),
    riskLevel,
    attendanceRisk,
    behaviorRisk,
    academicRisk,
    suddenDrop,
    dropAmount,
    weakTopics,
    reasons,
    recommendations
  };
};
