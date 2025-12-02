import { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";
import axios from "axios";

export default function StudentAttendance() {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const [attendance, setAttendance] = useState(null);

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"];
  const randomHistory = [70, 72, 68, 74, 80, 85, 82];

  const getColor = (value) => {
    if (value < 60) return "status-red";
    if (value < 75) return "status-yellow";
    return "status-green";
  };

  useEffect(() => {
    // Load student's real attendance
    const user = JSON.parse(localStorage.getItem("user"));

    axios
      .get(`http://localhost:5000/api/students/${user._id}`)
      .then((res) => {
        setAttendance(res.data.attendance);
      })
      .catch((err) => console.error("Failed to load attendance", err));
  }, []);

  useEffect(() => {
    if (chartInstance.current) chartInstance.current.destroy();

    const ctx = chartRef.current.getContext("2d");

    chartInstance.current = new Chart(ctx, {
      type: "line",
      data: {
        labels: months,
        datasets: [
          {
            label: "Attendance %",
            data: randomHistory,
            borderColor: "#7a001e",
            backgroundColor: "rgba(122, 0, 30, 0.2)",
            borderWidth: 3,
            tension: 0.4,
            fill: true,
          },
        ],
      },
      options: { responsive: true, maintainAspectRatio: false },
    });

    return () => chartInstance.current.destroy();
  }, []);

  return (
    <div className="p-4" style={{ minHeight: "100vh", background: "#f7f3ec" }}>
      <div
        style={{
          background: "white",
          padding: "1.2rem 1.5rem",
          borderRadius: "16px",
          marginBottom: "2rem",
        }}
      >
        <h3 style={{ color: "#7a001e", margin: 0 }}>Attendance Overview</h3>
        <p className="text-muted">Your attendance performance</p>
      </div>

      <div className="chic-card p-4 text-center mb-4">
        <h5 className="burgundy-title">Current Attendance</h5>
        <h1 className={getColor(attendance)}>{attendance ?? "—"}%</h1>
      </div>

      <div className="chic-card p-4" style={{ height: "350px" }}>
        <canvas ref={chartRef}></canvas>
      </div>
    </div>
  );
}
