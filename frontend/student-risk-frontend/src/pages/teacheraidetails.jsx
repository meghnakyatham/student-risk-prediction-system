// frontend/src/teacherAIDetails.jsx

import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function TeacherAIDetails() {
  const { id } = useParams();
  const [ai, setAi] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/teachers/ai/${id}`)
      .then((res) => setAi(res.data))
      .catch((err) => console.error("AI detail error:", err));
  }, [id]);

  if (!ai) return <p style={{ padding: "2rem" }}>Loading AI analysis...</p>;

  return (
    <div className="p-4" style={{ background: "#f7f3ec", minHeight: "100vh" }}>
      <h3 style={{ color: "#7a001e" }}>AI Analysis Summary</h3>

      <div
        className="p-4 chic-card mt-3"
        style={{
          background: "white",
          borderRadius: "16px",
          boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
        }}
      >
        <h5 className="burgundy-title">Overall Risk</h5>
        <p><strong>Risk Level:</strong> {ai.riskLevel}</p>
        <p><strong>Risk Score:</strong> {ai.riskScore}</p>

        <hr />

        <h5 className="burgundy-title">Risk Breakdown</h5>
        <ul>
          <li><strong>Academic Risk:</strong> {ai.academicRisk}</li>
          <li><strong>Attendance Risk:</strong> {ai.attendanceRisk}</li>
          <li><strong>Behavior Risk:</strong> {ai.behaviorRisk}</li>
        </ul>

        {ai.suddenDrop && (
          <div
            className="alert alert-warning"
            style={{
              background: "#fff4e5",
              borderRadius: "10px",
              border: "1px solid #f0c36d",
              padding: "10px",
            }}
          >
            <strong>⚠ Sudden CGPA Drop: </strong>
            The student’s CGPA dropped by {ai.dropAmount} compared to last semester.
          </div>
        )}

        <hr />

        <h5 className="burgundy-title">Weak Subjects & Topics</h5>
        <ul>
          {ai.weakTopics?.map((item, index) => (
            <li key={index}>
              <strong>{item.subject}</strong> — {item.topics.join(", ")}
            </li>
          ))}
        </ul>

        <hr />

        <h5 className="burgundy-title">Reasons</h5>
        <ul>
          {ai.reasons?.map((r, i) => (
            <li key={i}>{r}</li>
          ))}
        </ul>

        <hr />

        <h5 className="burgundy-title">Recommendations</h5>
        <ul>
          {ai.recommendations?.map((rec, i) => (
            <li key={i}>{rec}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
