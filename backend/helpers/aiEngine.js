// backend/helpers/aiEngine.js

function safeNumber(value, fallback = 0) {
  return typeof value === "number" && !isNaN(value) ? value : fallback;
}

function analyzeStudent(data) {
  const attendance = safeNumber(data.attendance);
  const behavior = safeNumber(data.behavior);
  const knowledge = safeNumber(data.knowledge);
  const assignmentsDue = safeNumber(data.assignmentsDue);
  const cgpaHistory = Array.isArray(data.cgpaHistory) ? data.cgpaHistory : [];
  const marks = Array.isArray(data.marks) ? data.marks : [];
  const comments = Array.isArray(data.comments) ? data.comments : [];

  let reasons = [];
  let recommendations = [];

  // -----------------------------
  // 1) Attendance Risk
  // -----------------------------
  let attendanceRisk = "Low";
  if (attendance < 60) {
    attendanceRisk = "High";
    reasons.push("Very low attendance.");
  } else if (attendance < 75) {
    attendanceRisk = "Medium";
    reasons.push("Moderate attendance issues.");
  }

  if (attendance < 75) {
    recommendations.push("Student should attend all lectures for the next 2 weeks.");
    recommendations.push("Teacher should monitor attendance closely.");
  }

  // -----------------------------
  // 2) Behavioural Risk
  // -----------------------------
  let behaviorRisk = "Low";
  if (behavior < 50) {
    behaviorRisk = "High";
    reasons.push("Behavior score is affecting academic performance.");
    recommendations.push("Suggest a counseling session for behavior improvement.");
  } else if (behavior < 65) {
    behaviorRisk = "Medium";
    reasons.push("Behaviour could be improved for better focus.");
  }

  // -----------------------------
  // 3) Academic Risk
  // -----------------------------
  let academicRisk = "Low";

  if (knowledge < 60) {
    academicRisk = "Medium";
    reasons.push("Knowledge gaps detected in key subjects.");
    recommendations.push("Student should revise last 2–3 chapters thoroughly.");
  }

  if (assignmentsDue > 3) {
    academicRisk = "High";
    reasons.push("Too many pending assignments.");
    recommendations.push("Complete pending assignments by this weekend.");
  } else if (assignmentsDue > 1) {
    if (academicRisk === "Low") academicRisk = "Medium";
    reasons.push("Assignment backlog building up.");
  }

  // -----------------------------
  // 4) Sudden CGPA drop detection
  // -----------------------------
  let suddenDrop = false;
  let dropAmount = 0;

  if (cgpaHistory.length >= 2) {
    const last = safeNumber(cgpaHistory[cgpaHistory.length - 1].cgpa);
    const prev = safeNumber(cgpaHistory[cgpaHistory.length - 2].cgpa);
    dropAmount = +(prev - last).toFixed(1);

    if (dropAmount >= 0.5) {
      suddenDrop = true;
      reasons.push(`Sudden CGPA drop of ${dropAmount} compared to previous semester.`);
      if (academicRisk === "Low") academicRisk = "Medium";
      recommendations.push("Teacher should review recent tests to identify why performance dropped.");
    }
  }

  // -----------------------------
  // 5) Topic-wise weakness detection
  // -----------------------------
  const weakSubjects = [];
  const weakTopics = [];

  // simple subject-topic mapping for explanation
  const subjectTopicMap = {
    Math: ["Algebra basics", "Geometry", "Word problems"],
    Science: ["Physics fundamentals", "Chemistry reactions", "Biology diagrams"],
    English: ["Grammar", "Comprehension", "Writing skills"],
    "Computer Science": ["Logic building", "Programming basics", "Data structures"]
  };

  marks.forEach((m) => {
    const subject = m.subject || "";
    const score = safeNumber(m.score);

    if (score < 60) {
      weakSubjects.push(subject);

      const topics = subjectTopicMap[subject] || ["Core concepts need revision."];
      // pick up to 2 topics
      weakTopics.push({
        subject,
        topics: topics.slice(0, 2),
        score,
      });

      reasons.push(`Low marks in ${subject}.`);
      recommendations.push(`Revise fundamental topics in ${subject}.`);
    }
  });

  // -----------------------------
  // 6) Combine risks into overall
  // -----------------------------
  // convert risk strings to numeric for easy combining
  const riskToScore = (r) =>
    r === "High" ? 3 : r === "Medium" ? 2 : 1;

  const combinedScore =
    riskToScore(academicRisk) +
    riskToScore(attendanceRisk) +
    riskToScore(behaviorRisk);

  let overallRisk = "Low";
  if (combinedScore >= 7) overallRisk = "High";
  else if (combinedScore >= 5) overallRisk = "Medium";

  // numeric overall riskScore (0–100 style)
  let riskScore = 100;

  if (overallRisk === "High") riskScore = 35;
  else if (overallRisk === "Medium") riskScore = 65;
  else riskScore = 85;

  // remove duplicates from reasons & recommendations
  reasons = [...new Set(reasons)];
  recommendations = [...new Set(recommendations)];

  return {
    // old fields (for compatibility)
    riskScore,
    riskLevel: overallRisk,
    category: overallRisk, // you were using this earlier
    reasons,
    recommendations,

    // new fields for your internship task
    academicRisk,
    attendanceRisk,
    behaviorRisk,
    suddenDrop,
    dropAmount,
    weakSubjects,
    weakTopics,
  };
}

module.exports = { analyzeStudent };
