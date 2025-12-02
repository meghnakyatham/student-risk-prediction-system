import { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";

export default function ParentRisk() {

  // TEMP DATA (later from backend)
  const child = {
    name: "Aarav Sharma",
    attendance: 72,
    behavior: 65,
    knowledge: 78,
    assignmentsDue: 2,
    risk: "High",
  };

  // RISK TREND (last few months)
  const riskTrend = ["Medium", "Medium", "High", "High"];
  const months = ["Apr", "May", "Jun", "Jul"];

  const numericTrend = riskTrend.map((r) =>
    r === "High" ? 3 : r === "Medium" ? 2 : 1
  );

  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  const getColor = (value) => {
    if (value === "High" || value < 60) return "status-red";
    if (value === "Medium" || (value >= 60 && value < 75)) return "status-yellow";
    return "status-green";
  };

  useEffect(() => {
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext("2d");

    chartInstance.current = new Chart(ctx, {
      type: "line",
      data: {
        labels: months,
        datasets: [
          {
            label: "Risk Level (1=Low, 2=Medium, 3=High)",
            data: numericTrend,
            borderColor: "#7a001e",
            backgroundColor: "rgba(122, 0, 30, 0.15)",
            borderWidth: 3,
            tension: 0.4,
            fill: true,
            pointRadius: 4,
            pointBackgroundColor: "#7a001e",
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
      },
    });

    return () => chartInstance.current.destroy();
  }, []);

  return (
    <div className="p-4" style={{ background: "#f7f3ec", minHeight: "100vh" }}>

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
        <h3 style={{ color: "#7a001e", margin: 0 }}>Risk Analysis</h3>
        <p className="text-muted">Understand the factors affecting your child's performance</p>
      </div>

      {/* MAIN RISK LEVEL */}
      <div className="chic-card p-4 mb-4 text-center">
        <h5 className="burgundy-title">Overall Risk Level</h5>
        <h1 className={getColor(child.risk)}>{child.risk}</h1>

        <p className="text-muted mt-2">
          {child.risk === "High"
            ? "Immediate attention required - multiple academic areas need improvement."
            : child.risk === "Medium"
            ? "Some issues identified - moderate support recommended."
            : "Child is performing well overall."}
        </p>
      </div>

      {/* RISK FACTORS */}
      <div className="row g-4">

        <div className="col-md-3">
          <div className="chic-card p-3 text-center">
            <h6 className="burgundy-title">Attendance</h6>
            <h2 className={getColor(child.attendance)}>{child.attendance}%</h2>
          </div>
        </div>

        <div className="col-md-3">
          <div className="chic-card p-3 text-center">
            <h6 className="burgundy-title">Behavior</h6>
            <h2 className={getColor(child.behavior)}>{child.behavior}</h2>
          </div>
        </div>

        <div className="col-md-3">
          <div className="chic-card p-3 text-center">
            <h6 className="burgundy-title">Knowledge</h6>
            <h2 className={getColor(child.knowledge)}>{child.knowledge}</h2>
          </div>
        </div>

        <div className="col-md-3">
          <div className="chic-card p-3 text-center">
            <h6 className="burgundy-title">Assignments Due</h6>
            <h2 className={child.assignmentsDue > 2 ? "status-red" : "status-yellow"}>
              {child.assignmentsDue}
            </h2>
          </div>
        </div>

      </div>

      {/* TREND GRAPH */}
      <div className="chic-card p-4 mt-4" style={{ height: "350px" }}>
        <h5 className="burgundy-title mb-3">Risk Trend Over Months</h5>
        <canvas ref={chartRef}></canvas>
      </div>

      {/* RECOMMENDATIONS */}
      <div className="chic-card p-4 mt-4">
        <h5 className="burgundy-title mb-3">Recommendations</h5>
        <ul>
          <li>Increase attendance above 80% to reduce risk level.</li>
          <li>Encourage focus during classes to improve behavior score.</li>
          <li>Review key academic concepts regularly.</li>
          <li>Follow up on pending assignments to avoid grade drops.</li>
        </ul>
      </div>

    </div>
  );
}
