import { useEffect, useState } from "react";
import axios from "axios";

export default function StudentAIAnalysis() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [analysis, setAnalysis] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/ai/${user._id}`)
      .then((res) => setAnalysis(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="d-flex" style={{ height: "100vh", background: "#f7f3ec" }}>
      
      {/* SIDEBAR EXACT SAME STYLE */}
      <div className="sidebar fade">
        <h3 className="sidebar-title">STUDENT PORTAL</h3>

        <p className="sidebar-item" onClick={() => window.location.href="/student/dashboard"}>Dashboard</p>
        <p className="sidebar-item sidebar-active">AI Analysis</p>

      </div>

      {/* MAIN CONTENT */}
      <div className="flex-grow-1 p-4">
        <h3 className="burgundy-title">AI Performance Analysis</h3>
        <p className="text-muted mb-3">Generated from your full academic data</p>

        {!analysis ? (
          <p>Loading AI insights...</p>
        ) : (
          <div className="chic-card p-4" style={{ borderRadius: "16px" }}>
            
            <h5>Risk Category: {analysis.riskCategory}</h5>
            <p>Overall Risk Score: {analysis.overallRiskScore}</p>

            <h6 className="mt-3 burgundy-title">Key Reasons</h6>
            <ul>
              {analysis.keyReasons?.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>

            <h6 className="mt-3 burgundy-title">Interventions</h6>
            <ul>
              {analysis.suggestedInterventions?.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>

            <h6 className="mt-3 burgundy-title">Parent Guidance</h6>
            <p>{analysis.parentGuidance}</p>

          </div>
        )}
      </div>
    </div>
  );
}
