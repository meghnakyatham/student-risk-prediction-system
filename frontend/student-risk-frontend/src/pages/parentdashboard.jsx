import { useEffect, useState } from "react";
import axios from "axios";

export default function ParentDashboard() {
  const parent = JSON.parse(localStorage.getItem("user"));
  const [child, setChild] = useState(null);
  const [aiReport, setAiReport] = useState(null);


  const getColor = (value) => {
    if (value === "High" || value < 60) return "status-red";
    if (value === "Medium" || (value >= 60 && value < 75)) return "status-yellow";
    return "status-green";
  };

  useEffect(() => {
  if (!parent?._id) return;

  axios.get(`http://localhost:5000/api/parents/ai/${parent._id}`)
    .then((res) => setAiReport(res.data))
    .catch((err) => console.error("Parent AI error", err));
}, [parent?._id]);




  return (
    <div className="d-flex" style={{ height: "100vh", background: "#f7f3ec" }}>
      {/* SIDEBAR */}
      <div
        style={{
          width: "260px",
          backgroundColor: "#7a001e",
          color: "white",
          padding: "2rem 1.5rem",
          display: "flex",
          flexDirection: "column",
          gap: "2rem",
        }}
      >
        <h3 style={{ fontWeight: "700", letterSpacing: "1px" }}>PARENT PORTAL</h3>

        <div style={{ opacity: 0.9 }}>
          <p className="mb-1">Logged in as:</p>
          <h5 style={{ fontWeight: "600" }}>{parent?.name}</h5>
          <small>{parent?.email}</small>
        </div>

        <div style={{ borderTop: "1px solid #ffffff55", paddingTop: "1rem" }}>
          <p
            className="sidebar-item"
            onClick={() => (window.location.href = "/parent/dashboard")}
          >
            Dashboard
          </p>

          <p
            className="sidebar-item"
            onClick={() => (window.location.href = "/parent/attendance")}
          >
            Attendance
          </p>

          <p
            className="sidebar-item"
            onClick={() => (window.location.href = "/parent/risk")}
          >
            Risk Factor
          </p>

          <p
            className="sidebar-item"
            onClick={() => (window.location.href = "/parent/comments")}
          >
            Comments
          </p>

          <p
            className="sidebar-item"
            onClick={() => (window.location.href = "/parent/logout")}
          >
            Logout
          </p>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-grow-1 p-4">
        {/* HEADER */}
        <div
          style={{
            background: "white",
            padding: "1.2rem 1.5rem",
            borderRadius: "16px",
            boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
            marginBottom: "2rem",
          }}
        >
          <h3 style={{ color: "#7a001e", margin: 0 }}>
            Welcome, {parent?.name}
          </h3>
          <p className="text-muted">Here is your child’s academic overview</p>
        </div>

        {/* CHILD INFO */}
        <div className="chic-card p-4 mb-4">
          <h4 className="burgundy-title mb-3">
            {child?.childName || "Your Child"}
          </h4>

          <div className="row g-4">
            <div className="col-md-3">
              <div className="p-3 text-center chic-card">
                <h6 className="burgundy-title">Attendance</h6>
                <h2 className={getColor(child?.attendance ?? 100)}>
                  {child?.attendance ?? "—"}%
                </h2>
              </div>
            </div>

            <div className="col-md-3">
              <div className="p-3 text-center chic-card">
                <h6 className="burgundy-title">Risk Level</h6>
                <h2 className={getColor(child?.risk)}>{child?.risk || "—"}</h2>
              </div>
            </div>

            <div className="col-md-3">
              <div className="p-3 text-center chic-card">
                <h6 className="burgundy-title">Behavior</h6>
                <h2 className={getColor(child?.behavior ?? 100)}>
                  {child?.behavior ?? "—"}
                </h2>
              </div>
            </div>

            <div className="col-md-3">
              <div className="p-3 text-center chic-card">
                <h6 className="burgundy-title">Knowledge</h6>
                <h2 className={getColor(child?.knowledge ?? 100)}>
                  {child?.knowledge ?? "—"}
                </h2>
              </div>
            </div>
          </div>
        </div>

        {/* ⭐ PARENT AI ANALYSIS PANEL */}
{aiReport && (
  <div
    className="p-4 chic-card mb-4"
    style={{
      background: "white",
      borderRadius: "16px",
      boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
    }}
  >
    <h4 className="burgundy-title mb-3">AI Insights About Your Child</h4>

    <p><strong>Overall Risk:</strong> {aiReport.riskLevel}</p>
    <p><strong>Risk Score:</strong> {aiReport.riskScore}</p>

    <div className="d-flex flex-wrap mt-3 mb-3" style={{ gap: "1rem" }}>
      <div
        className="p-2"
        style={{ background: "#faf7f2", borderRadius: "10px", minWidth: "180px" }}
      >
        <strong>Academic Risk:</strong> <div>{aiReport.academicRisk}</div>
      </div>

      <div
        className="p-2"
        style={{ background: "#faf7f2", borderRadius: "10px", minWidth: "180px" }}
      >
        <strong>Attendance Risk:</strong> <div>{aiReport.attendanceRisk}</div>
      </div>

      <div
        className="p-2"
        style={{ background: "#faf7f2", borderRadius: "10px", minWidth: "180px" }}
      >
        <strong>Behavior Risk:</strong> <div>{aiReport.behaviorRisk}</div>
      </div>
    </div>

    {/* Sudden Drop Warning */}
    {aiReport.suddenDrop && (
      <div
        className="alert alert-warning"
        style={{
          background: "#fff4e5",
          borderRadius: "10px",
          border: "1px solid #f0c36d",
        }}
      >
        <strong>Important:</strong> Your child’s CGPA dropped by {aiReport.dropAmount}.
      </div>
    )}

    <hr />

    {/* Weak Subjects */}
    {aiReport.weakTopics && aiReport.weakTopics.length > 0 && (
      <>
        <h6 className="mb-2">Subjects Needing Attention</h6>
        <ul>
          {aiReport.weakTopics.map((w, index) => (
            <li key={index}>
              <strong>{w.subject}</strong> — weak in {w.topics.join(", ")}
            </li>
          ))}
        </ul>
      </>
    )}

    {/* Reasons */}
    <h6 className="mt-3 mb-2">Why These Risks Exist</h6>
    <ul>
      {aiReport.reasons?.map((r, idx) => (
        <li key={idx}>{r}</li>
      ))}
    </ul>

    {/* Parent Guidance */}
    <h6 className="mt-3 mb-2">How You Can Help</h6>
    <ul>
      {aiReport.recommendations?.map((rec, idx) => (
        <li key={idx}>{rec}</li>
      ))}
    </ul>
  </div>
)}


        {/* SUMMARY BOXES */}
        <div className="row g-4">
          <div className="col-md-6">
            <div className="chic-card p-4">
              <h5 className="burgundy-title">Quick Insights</h5>
              <ul>
                <li>
                  Attendance:{" "}
                  {child?.attendance != null
                    ? `${child.attendance}%`
                    : "data unavailable"}
                </li>
                <li>Assignments pending: {child?.assignmentsDue ?? "—"}</li>
                <li>Risk level: {child?.risk || "—"}</li>
                {child?.riskReasons?.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="col-md-6">
            <div className="chic-card p-4">
              <h5 className="burgundy-title">Recommendations</h5>
              <ul>
                <li>Encourage consistent attendance.</li>
                <li>Help revise weak subjects regularly.</li>
                <li>Set a fixed study schedule.</li>
                <li>Review assignment deadlines together.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
