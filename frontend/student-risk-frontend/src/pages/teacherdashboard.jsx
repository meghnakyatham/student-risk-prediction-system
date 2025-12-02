import { useEffect, useState } from "react";
import axios from "axios";

export default function TeacherDashboard() {
  const teacher = JSON.parse(localStorage.getItem("teacher"));
  const [students, setStudents] = useState([]);
  const [highRisk, setHighRisk] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/students")
      .then((res) => {
        setStudents(res.data);

        const risky = res.data.filter((s) => s.risk === "High");
        setHighRisk(risky);

        // TEMP activity (replace later with real data)
        setRecentActivity([
          "Marked attendance for class today",
          "Created new assignment: Algebra Practice",
          "Added comment for Aarav",
        ]);
      })
      .catch((err) => console.error(err));
  }, []);

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
        <h3 style={{ fontWeight: "700" }}>TEACHER PORTAL</h3>

        <div style={{ opacity: 0.9 }}>
          <p className="mb-1">Logged in as:</p>
          <h5>{teacher?.name}</h5>
          <small>{teacher?.email}</small>
        </div>

        <div style={{ borderTop: "1px solid #ffffff55", paddingTop: "1rem" }}>
          <p className="sidebar-item" onClick={() => (window.location.href = "/teacher/dashboard")}>
            Dashboard
          </p>
          <p className="sidebar-item" onClick={() => (window.location.href = "/teacher/students")}>
            Student List
          </p>
          <p className="sidebar-item" onClick={() => (window.location.href = "/teacher/lecture-attendance")}>
            Lecture Attendance
          </p>
          <p className="sidebar-item" onClick={() => (window.location.href = "/teacher/teacherLectures")}>
            Teacher Lectures
            </p>

          <p className="sidebar-item" onClick={() => (window.location.href = "/teacher/ai")}>
            AI Insights
            </p>


          <p className="sidebar-item" onClick={() => (window.location.href = "/teacher/assignments")}>
            Assignments
          </p>
          <p className="sidebar-item" onClick={() => (window.location.href = "/teacher/attendance")}>
            Attendance
          </p>
          <p className="sidebar-item" onClick={() => (window.location.href = "/teacher/comments")}>
            Comments
          </p>
          <p className="sidebar-item" onClick={() => (window.location.href = "/teacher/logout")}>
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
          <h3 style={{ color: "#7a001e", margin: 0 }}>Welcome, {teacher?.name}</h3>
          <p className="text-muted">Quick overview of today's important updates</p>
        </div>

        {/* METRICS SECTION */}
        <div className="row g-4 mb-4">
          
          <div className="col-md-3">
            <div className="chic-card p-4 text-center">
              <h6 className="burgundy-title">Total Students</h6>
              <h2>{students.length}</h2>
            </div>
          </div>

          <div className="col-md-3">
            <div className="chic-card p-4 text-center">
              <h6 className="burgundy-title">High-Risk Students</h6>
              <h2 className="status-red">{highRisk.length}</h2>
            </div>
          </div>

          <div className="col-md-3">
            <div className="chic-card p-4 text-center">
              <h6 className="burgundy-title">Assignments</h6>
              <h2 className="status-yellow">3 Pending</h2>
            </div>
          </div>

          <div className="col-md-3">
            <div className="chic-card p-4 text-center">
              <h6 className="burgundy-title">Counseling Required</h6>
              <h2 className="status-red">{highRisk.length}</h2>
            </div>
          </div>

        </div>

        {/* QUICK ACTION BUTTONS */}

        
        <div className="row g-4 mb-4">

          <div className="col-md-3">
            <button
              className="btn w-100"
              style={{ background: "#7a001e", color: "white" }}
              onClick={() => window.location.href = "/teacher/students"}
            >
              View Students
            </button>
          </div>

          <div className="col-md-3">
            <button
              className="btn w-100"
              style={{ background: "#7a001e", color: "white" }}
              onClick={() => window.location.href = "/teacher/assignments"}
            >
              Add Assignment
            </button>
          </div>

          <div className="col-md-3">
            <button
              className="btn w-100"
              style={{ background: "#7a001e", color: "white" }}
              onClick={() => window.location.href = "/teacher/attendance"}
            >
              Mark Attendance
            </button>
          </div>

          <div className="col-md-3">
            <button
              className="btn w-100"
              style={{ background: "#7a001e", color: "white" }}
              onClick={() => window.location.href = "/teacher/comments"}
            >
              Review Comments
            </button>
          </div>

        </div>

        {/* HIGH RISK STUDENTS LIST */}
        <div className="chic-card p-4 mb-4">
          <h5 className="burgundy-title mb-3">High-Risk Students</h5>

          {highRisk.length === 0 ? (
            <p className="text-muted">No high-risk students at the moment.</p>
          ) : (
            highRisk.map((s) => (
              <div
                key={s._id}
                className="d-flex justify-content-between p-2"
                style={{
                  borderBottom: "1px solid #ddd"
                }}
              >
                <strong>{s.name}</strong>
                <span className="status-red">High</span>
              </div>
            ))
          )}
        </div>

        {/* RECENT ACTIVITY */}
        <div className="chic-card p-4">
          <h5 className="burgundy-title mb-3">Recent Activity</h5>

          <ul>
            {recentActivity.map((item, index) => (
              <li key={index} className="mb-2">{item}</li>
            ))}
          </ul>

        </div>

      </div>
    </div>
  );
}
