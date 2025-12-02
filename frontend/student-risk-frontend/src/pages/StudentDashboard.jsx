import { Line } from "react-chartjs-2";
import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement
} from "chart.js";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement
);

import axios from "axios";
import { useEffect, useState } from "react";

export default function StudentDashboard() {
  const user = JSON.parse(localStorage.getItem("user"));

  const [attendance, setAttendance] = useState(null);
  const [riskLevel, setRiskLevel] = useState(null);
  const [assignmentsDue, setAssignmentsDue] = useState(null);
  const [behavior, setBehavior] = useState(null);
  const [knowledge, setKnowledge] = useState(null);
  const [commentsCount, setCommentsCount] = useState(null);
  const [aiReport, setAiReport] = useState(null);


  // lecture-wise attendance
  const [lectureData, setLectureData] = useState([]);

  // timetable + day navigation
  const [timetable, setTimetable] = useState([]);
  const [currentDayIndex, setCurrentDayIndex] = useState(0);
  const weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  // daily attendance for timetable
  const [todayLectureStatus, setTodayLectureStatus] = useState([]);

  // cgpa chart
  const [cgpaHistory] = useState([
    { semester: "Sem 1", cgpa: 7.4 },
    { semester: "Sem 2", cgpa: 7.8 },
    { semester: "Sem 3", cgpa: 8.2 },
    { semester: "Sem 4", cgpa: 8.5 }
  ]);

  const getStatusColor = (value) => {
    if (value === null) return "status-red";
    if (value < 60) return "status-red";
    if (value < 75) return "status-yellow";
    return "status-green";
  };

  const calculateRiskFromValues = (attendance, assignmentsDue, behavior, knowledge) => {
    if (attendance < 60 || assignmentsDue > 3 || behavior < 50 || knowledge < 50)
      return { level: "High", reason: "Low performance metrics" };

    if (
      attendance < 75 ||
      assignmentsDue > 1 ||
      behavior < 65 ||
      knowledge < 65
    )
      return { level: "Medium", reason: "Moderate performance indicators" };

    return { level: "Low", reason: "Healthy overall performance" };
  };

  const groupByWeekday = (records) => {
    const map = {};
    records.forEach((r) => {
      const d = new Date(r.date);
      if (isNaN(d)) return;
      const weekday = d.toLocaleDateString("en-US", { weekday: "long" });
      if (!map[weekday]) map[weekday] = [];
      map[weekday].push(...r.lectures);
    });
    return map;
  };

  useEffect(() => {
    if (!user?._id) return;

    axios
      .get(`http://localhost:5000/api/students/${user._id}`)
      .then((res) => {
        const s = res.data;
        setAttendance(s.attendance);
        setAssignmentsDue(s.assignmentsDue);
        setBehavior(s.behavior);
        setKnowledge(s.knowledge);
        setCommentsCount(s.comments?.length || 0);

        // ✅ Always calculate risk from latest values
        const result = calculateRiskFromValues(
          s.attendance,
          s.assignmentsDue,
          s.behavior,
          s.knowledge
        );

        setRiskLevel(result);

      })
      .catch(() => {});
      

    axios
      .get(`http://localhost:5000/api/timetable/${user._id}`)
      .then((res) => setTimetable(res.data))
      .catch(() => {});

    axios
      .get(`http://localhost:5000/api/lectures/${user._id}`)
      .then((res) => setLectureData(res.data))
      .catch(() => {});

        // 🔥 AI Analysis
  axios
    .get(`http://localhost:5000/api/ai/${user._id}`)
    .then((res) => {
      setAiReport(res.data);
    })
    .catch((err) =>
      console.error("AI analysis error:", err)
    );

  }, []);

  useEffect(() => {
    fetchDailyAttendance();
  }, [currentDayIndex]);

  const goTodayMapping = () => {
    const d = new Date().getDay();
    return Math.max(0, Math.min(d - 1, 4));
  };

  const fetchDailyAttendance = () => {
    const dateObj = new Date();
    const diff = currentDayIndex - goTodayMapping();
    dateObj.setDate(dateObj.getDate() + diff);

    const selectedDate = dateObj.toISOString().split("T")[0];

    axios
      .get(`http://localhost:5000/api/lectures/${user._id}/${selectedDate}`)
      .then((res) => setTodayLectureStatus(res.data.lectures || []))
      .catch(() => setTodayLectureStatus([]));
  };

  const todaySchedule = timetable.find((x) => x.day === weekDays[currentDayIndex]);

  const goPrev = () => setCurrentDayIndex((p) => (p - 1 + 5) % 5);
  const goNext = () => setCurrentDayIndex((p) => (p + 1) % 5);
  const goToday = () => setCurrentDayIndex(goTodayMapping());

  const lecturesByDay = groupByWeekday(lectureData);

  const riskColor =
    { High: "status-red", Medium: "status-yellow", Low: "status-green" }[
      riskLevel?.level
    ] || "status-red";
    
  const getAttendanceColor = (value) => {
  if (value == null) return "#d6c5bd"; // neutral
  if (value < 60) return "#8b0000";    // red
  if (value < 75) return "#e0a800";    // yellow
  return "#2ecc71";                    // green
};
const attendanceChartData = {
  labels: ["Present", "Absent"],
  datasets: [
    {
      data: [attendance || 0, 100 - (attendance || 0)],
      backgroundColor: [
        getAttendanceColor(attendance || 0),
        "#d6c5bd"
      ],
      hoverBackgroundColor: [
        getAttendanceColor(attendance || 0),
        "#d9c8bf"
      ]
    }
  ]
};


  const attendanceChartOptions = { cutout: "70%" };

  const cgpaChartData = {
    labels: cgpaHistory.map((x) => x.semester),
    datasets: [
      {
        label: "CGPA",
        data: cgpaHistory.map((x) => x.cgpa),
        borderColor: "#8b0000",
        borderWidth: 3,
        tension: 0.4
      }
    ]
  };

  return (
    <div className="d-flex" style={{ height: "100vh", backgroundColor: "#f7f3ec" }}>
      
      {/* SIDEBAR */}
      <div className="sidebar fade">
        <h3 className="sidebar-title">STUDENT PORTAL</h3>

        <div style={{ opacity: 0.9 }}>
          <p className="mb-1">Logged in as:</p>
          <h5 style={{ fontWeight: "600" }}>{user?.name}</h5>
          <small>{user?.email}</small>
        </div>

        <div style={{ borderTop: "1px solid #ffffff55", paddingTop: "1rem" }}>
          <p className="sidebar-item" onClick={() => (window.location.href = "/student/dashboard")}>Dashboard</p>
          <p className="sidebar-item" onClick={() => (window.location.href = "/student/attendance")}>Attendance</p>
          <p className="sidebar-item" onClick={() => (window.location.href = "/student/assignments")}>Assignments</p>
          <p className="sidebar-item" onClick={() => (window.location.href = "/student/comments")}>Comments</p>
          <p className="sidebar-item" onClick={() => (window.location.href = "/student/performance")}>Performance</p>
          <p className="sidebar-item" onClick={() => (window.location.href = "/student/risk")}>Risk Factor</p>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-grow-1 p-4">
        
        {/* Header */}
        <div
          style={{
            background: "white",
            padding: "1rem 1.5rem",
            borderRadius: "16px",
            marginBottom: "1.5rem",
          }}
        >
          <h3 style={{ color: "#7a001e" }}>Welcome, {user?.name}</h3>
          <p className="text-muted">Here's an overview of your performance</p>
        </div>
        {/* AI ANALYSIS PANEL */}
{aiReport && (
  <div
    className="p-4 chic-card mb-4"
    style={{
      background: "white",
      borderRadius: "16px",
      boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
    }}
  >
    <h4 className="burgundy-title mb-3">AI Performance Analysis</h4>

    {/* Overall Risk Summary */}
    <div className="mb-3">
      <p style={{ marginBottom: "4px" }}>
        <strong>Overall Risk Level:</strong> {aiReport.riskLevel}
      </p>
      <p style={{ marginBottom: "4px" }}>
        <strong>Overall Risk Score:</strong> {aiReport.riskScore}
      </p>
    </div>

    {/* Categorized Risks */}
    <div
      className="d-flex flex-wrap mb-3"
      style={{ gap: "1rem" }}
    >
      <div
        className="p-2"
        style={{ background: "#faf7f2", borderRadius: "10px", minWidth: "180px" }}
      >
        <strong>Academic Risk:</strong>
        <div>{aiReport.academicRisk}</div>
      </div>

      <div
        className="p-2"
        style={{ background: "#faf7f2", borderRadius: "10px", minWidth: "180px" }}
      >
        <strong>Attendance Risk:</strong>
        <div>{aiReport.attendanceRisk}</div>
      </div>

      <div
        className="p-2"
        style={{ background: "#faf7f2", borderRadius: "10px", minWidth: "180px" }}
      >
        <strong>Behavioural Risk:</strong>
        <div>{aiReport.behaviorRisk}</div>
      </div>
    </div>

    {/* Sudden Score Drop */}
    {aiReport.suddenDrop && (
      <div
        className="alert alert-warning"
        style={{
          background: "#fff4e5",
          borderRadius: "10px",
          border: "1px solid #f0c36d",
        }}
      >
        <strong>Alert:</strong> CGPA dropped by {aiReport.dropAmount}. Recent academic performance is declining.
      </div>
    )}

    <hr />

    {/* Weak Subjects & Topics */}
    {aiReport.weakTopics && aiReport.weakTopics.length > 0 && (
      <>
        <h6 className="mb-2">Topic-wise Weaknesses</h6>
        <ul>
          {aiReport.weakTopics.map((wt, idx) => (
            <li key={idx}>
              <strong>{wt.subject}</strong> (Score: {wt.score}) — Needs work on{" "}
              {wt.topics.join(", ")}
            </li>
          ))}
        </ul>
      </>
    )}

    {/* Reasons */}
    {aiReport.reasons && aiReport.reasons.length > 0 && (
      <>
        <h6 className="mt-3 mb-2">Key Reasons</h6>
        <ul>
          {aiReport.reasons.map((r, idx) => (
            <li key={idx}>{r}</li>
          ))}
        </ul>
      </>
    )}

    {/* Recommendations / Interventions */}
    {aiReport.recommendations && aiReport.recommendations.length > 0 && (
      <>
        <h6 className="mt-3 mb-2">Suggested Interventions</h6>
        <ul>
          {aiReport.recommendations.map((rec, idx) => (
            <li key={idx}>{rec}</li>
          ))}
        </ul>
      </>
    )}
  </div>
)}



        {/* Top 3 Cards */}
        <div className="row g-4">

          <div className="col-md-4">
            <div className="p-4 chic-card text-center">
              <h5 className="burgundy-title">Attendance</h5>
              <h1 className={getStatusColor(attendance)}>
                {attendance !== null ? `${attendance}%` : "—%"}
              </h1>
            </div>
          </div>

          <div className="col-md-4">
            <div className="p-4 chic-card text-center">
              <h5 className="burgundy-title">Risk Level</h5>
              <h2 className={riskColor}>{riskLevel?.level || "—"}</h2>
              <p className="text-muted">{riskLevel?.reason}</p>
            </div>
          </div>

          <div className="col-md-4">
            <div className="p-4 chic-card text-center">
              <h5 className="burgundy-title">Assignments Due</h5>
              <h1>{assignmentsDue || 0}</h1>
            </div>
          </div>

        </div>

        {/* Charts */}
        <div className="row g-4 mt-3 mb-4">

          <div className="col-md-4">
            <div className="chic-card p-4 text-center">
              <h5 className="burgundy-title">Attendance Overview</h5>
              <Doughnut data={attendanceChartData} options={attendanceChartOptions} />
            </div>
          </div>

          <div className="col-md-8">
            <div className="chic-card p-4">
              <h5 className="burgundy-title">CGPA Progress</h5>
              <Line data={cgpaChartData} />
            </div>
          </div>

        </div>

        {/* Daily Timetable */}
        <div className="chic-card p-4 mb-4">

          <h5 className="burgundy-title mb-3">My Classes</h5>

          <div className="d-flex align-items-center mb-3">
            <button className="btn btn-sm" style={{ background: "#8b0000", color: "white" }} onClick={goPrev}>←</button>
            <button className="btn btn-sm mx-2" style={{ background: "#d3c1b8" }} onClick={goToday}>Today</button>
            <button className="btn btn-sm" style={{ background: "#8b0000", color: "white" }} onClick={goNext}>→</button>

            <h5 className="ms-3">{weekDays[currentDayIndex]}</h5>
          </div>

          {!todaySchedule ? (
            <p className="text-muted">No classes scheduled.</p>
          ) : (
            todaySchedule.lectures.map((lec, index) => (
              <div
                key={index}
                className="d-flex justify-content-between p-3 mb-2"
                style={{ background: "#faf7f2", borderRadius: "12px" }}
              >
                <div>
                  <strong>{lec.start} - {lec.end}</strong>
                  <br />
                  {lec.subject}
                  <br />
                  <small className="text-muted">{lec.faculty} • Room {lec.room}</small>
                </div>

                <div
                  style={{
                    width: "18px",
                    height: "18px",
                    borderRadius: "50%",
                    background:
                      todayLectureStatus[index]?.status === "Absent" ? "#8b0000" : todayLectureStatus[index]?.status === "Present"? "#2ecc71": "#d6c5bd"
                  }}
                ></div>
              </div>
            ))
          )}
        </div>

        {/* Weekly Grid */}
        <div className="chic-card p-4 mt-4">
          <h5 className="burgundy-title mb-3">Lecture Attendance (This Week)</h5>

          <table className="table">
            <thead>
              <tr>
                <th>Day</th>
                <th className="text-center">Lectures</th>
              </tr>
            </thead>
            <tbody>
              {weekDays.map((day) => {
                const todayRecords = lecturesByDay[day] || [];
                return (
                  <tr key={day}>
                    <td style={{ fontWeight: 600 }}>{day}</td>
                    <td>
                      {todayRecords.length === 0 ? (
                        <span className="text-muted">No data</span>
                      ) : (
                        todayRecords.map((lec, idx) => (
                          <span
                            key={idx}
                            style={{
                              display: "inline-block",
                              width: "14px",
                              height: "14px",
                              margin: "3px",
                              borderRadius: "50%",
                              background:
                                lec.status === "Present" ? "#2ecc71" : "#8b0000"
                            }}
                          ></span>
                        ))
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}

