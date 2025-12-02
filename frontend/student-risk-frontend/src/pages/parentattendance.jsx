import { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";
import axios from "axios";

export default function ParentAttendance() {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  const attendanceHistory = [70, 72, 75, 65, 78, 80, 82];
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"];

  const [attendance, setAttendance] = useState(72);

  const getColor = (value) => {
    if (value < 60) return "status-red";
    if (value >= 60 && value < 75) return "status-yellow";
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
            label: "Attendance %",
            data: attendanceHistory,
            borderColor: "#7a001e",
            backgroundColor: "rgba(122, 0, 30, 0.2)",
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
        plugins: {
          legend: {
            labels: {
              color: "#7a001e",
              font: { size: 14, weight: "bold" },
            },
          },
        },
      },
    });

    return () => chartInstance.current.destroy();
  }, []);

  useEffect(() => {
    const parent = JSON.parse(localStorage.getItem("user"));
    if (!parent?._id) return;

    axios
      .get(`http://localhost:5000/api/parents/dashboard/${parent._id}`)
      .then((res) => {
        if (res.data?.attendance != null) {
          setAttendance(res.data.attendance);
        }
      })
      .catch((err) => {
        console.error(err);
      });
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
        <h3 style={{ color: "#7a001e", margin: 0 }}>Attendance Overview</h3>
        <p className="text-muted">Track your child's attendance over months</p>
      </div>

      {/* SUMMARY CARD */}
      <div className="chic-card p-4 mb-4">
        <h5 className="burgundy-title mb-2">Current Attendance</h5>
        <h1 className={getColor(attendance)}>{attendance}%</h1>
        <p className="text-muted">
          {attendance < 60
            ? "Low attendance - needs immediate improvement."
            : attendance < 75
            ? "Moderate attendance - can be better."
            : "Excellent attendance - keep it up!"}
        </p>
      </div>

      {/* GRAPH */}
      <div className="chic-card p-4" style={{ height: "350px" }}>
        <canvas ref={chartRef}></canvas>
      </div>
    </div>
  );
}
