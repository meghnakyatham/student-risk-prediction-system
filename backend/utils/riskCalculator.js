// utils/riskCalculator.js

/**
 * Unified risk calculator for Student + Parent + Teacher views
 *
 * Supports both:
 *  - { attendancePercent, missingAssignments }
 *  - { attendance, behavior, knowledge, assignmentsDue }
 * or a mix of them.
 */
function calculateRisk(input) {
  let {
    attendancePercent,
    attendance,
    behavior,
    knowledge,
    assignmentsDue,
    missingAssignments,
  } = input || {};

  // ---- Normalize inputs & fallbacks ----

  // Attendance: prefer `attendance`, else `attendancePercent`, else 100 (safe default)
  const att =
    typeof attendance === "number"
      ? attendance
      : typeof attendancePercent === "number"
      ? attendancePercent
      : 100;

  // Assignments: prefer assignmentsDue, else missingAssignments, else 0
  const assign =
    typeof assignmentsDue === "number"
      ? assignmentsDue
      : typeof missingAssignments === "number"
      ? missingAssignments
      : 0;

  // If behavior / knowledge not provided (e.g., older code paths),
  // treat them as "okay-ish" instead of 0 so they don't explode risk.
  const beh = typeof behavior === "number" ? behavior : 70;
  const know = typeof knowledge === "number" ? knowledge : 70;

  // ---- Risk band (Low / Medium / High) ----
  // This mirrors the logic in StudentDashboard.jsx

  let riskBand = "Low";

  if (att < 60 || assign > 3 || beh < 50 || know < 50) {
    riskBand = "High";
  } else if (
    (att >= 60 && att < 75) ||
    assign > 1 ||
    beh < 65 ||
    know < 65
  ) {
    riskBand = "Medium";
  }

  // ---- Numeric overall score (0–100 severity) ----
  const clamp = (v) => Math.min(Math.max(v, 0), 100);

  const attendanceScore = clamp(100 - att);          // lower attendance → higher risk
  const behaviorScore = clamp(100 - beh);            // lower behavior → higher risk
  const knowledgeScore = clamp(100 - know);          // lower knowledge → higher risk
  const assignmentScore = clamp(assign * 20);        // 0 = 0, 5+ ≈ 100

  const overallScore = Math.round(
    attendanceScore * 0.35 +
      behaviorScore * 0.2 +
      knowledgeScore * 0.2 +
      assignmentScore * 0.25
  );

  // ---- Reasons (for parent/teacher dashboards) ----
  const reasons = [];

  if (att < 75) {
    reasons.push(
      att < 60
        ? "Attendance is below 60%"
        : "Attendance is between 60% and 75%"
    );
  }

  if (beh < 65) {
    reasons.push(
      beh < 50
        ? "Behavior score is below 50"
        : "Behavior score is between 50 and 65"
    );
  }

  if (know < 65) {
    reasons.push(
      know < 50
        ? "Knowledge score is below 50"
        : "Knowledge score is between 50 and 65"
    );
  }

  if (assign > 0) {
    reasons.push(
      assign > 3
        ? `${assign} assignments pending (more than 3)`
        : `${assign} assignments pending`
    );
  }

  return {
    overallScore,
    riskBand, // "Low" | "Medium" | "High"
    reasons,
    factors: {
      attendance: att,
      behavior: beh,
      knowledge: know,
      assignmentsDue: assign,
    },
  };
}

module.exports = calculateRisk;
