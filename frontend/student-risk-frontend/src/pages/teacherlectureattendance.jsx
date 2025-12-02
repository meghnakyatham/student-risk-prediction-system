import { useEffect, useState } from "react";
import axios from "axios";

export default function TeacherLectureAttendance() {

  const teacher = JSON.parse(localStorage.getItem("user"));
  const [students, setStudents] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [lectureStatus, setLectureStatus] = useState({}); // studentId → lecture array

  // Load list of all students
  useEffect(() => {
    axios.get("http://localhost:5000/api/students")
      .then(res => {
        setStudents(res.data);
        setSelectedDate(new Date().toISOString().split("T")[0]); // today
      })
      .catch(err => console.error(err));
  }, []);

  // Toggle present/absent for one lecture
  const toggleStatus = (studentId, period) => {
    setLectureStatus(prev => {
      const lectures = prev[studentId] || Array(6).fill("Present");
      const newStatus = [...lectures];
      newStatus[period] = newStatus[period] === "Present" ? "Absent" : "Present";

      return {
        ...prev,
        [studentId]: newStatus,
      };
    });
  };

  // Save attendance to backend
  const saveAttendance = (studentId) => {
    const periods = lectureStatus[studentId] || Array(6).fill("Present");

    const lecturePayload = periods.map((status, index) => ({
      period: index + 1,
      status,
    }));

    axios.post("http://localhost:5000/api/lectures/mark", {
      studentId,
      date: selectedDate,
      lectures: lecturePayload,
    })
    .then(() => alert("Attendance saved!"))
    .catch(err => console.error(err));
  };

  return (
    <div className="d-flex" style={{ height: "100vh", backgroundColor: "#f7f3ec" }}>
      
      {/* SIDEBAR */}
      <div className="sidebar fade">
        <h3 className="sidebar-title">TEACHER PORTAL</h3>

        <div style={{ opacity: .9 }}>
          <p className="mb-1">Logged in as:</p>
          <h5 style={{ fontWeight: 600 }}>{teacher?.name}</h5>
          <small>{teacher?.email}</small>
        </div>

        <div style={{ borderTop: "1px solid #ffffff55", paddingTop: "1rem" }}>
          <p className="sidebar-item" onClick={() => window.location.href="/teacher/dashboard"}>
            Dashboard
          </p>
          <p className="sidebar-item" onClick={() => window.location.href="/teacher/students"}>
            Students
          </p>
          <p className="sidebar-item sidebar-active">
            Lecture Attendance
          </p>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-grow-1 p-4">

        <div className="chic-card p-3 mb-4" style={{ borderRadius: "16px" }}>
          <h4 className="burgundy-title">Lecture Attendance</h4>
          <p className="text-muted">Mark lecture-wise attendance for each student.</p>

          <label className="mt-2" style={{ fontWeight: 600 }}>Select Date:</label>
          <input
            type="date"
            className="form-control mt-1"
            style={{ width: "200px" }}
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>

        {/* STUDENT LIST */}
        <div className="chic-card p-4" style={{ borderRadius: "16px" }}>
          <h5 className="burgundy-title mb-3">Students List</h5>

          {students.map((s) => (
            <div key={s._id} className="p-3 mb-3"
              style={{ background: "#faf7f2", borderRadius: "12px" }}>

              <div className="d-flex justify-content-between">
                <div>
                  <h6 style={{ margin: 0 }}>{s.name}</h6>
                  <small className="text-muted">{s.email}</small>
                </div>

                {/* SAVE BUTTON */}
                <button
                  className="btn btn-sm"
                  style={{
                    background: "#8b0000",
                    color: "white",
                    borderRadius: "8px",
                  }}
                  onClick={() => saveAttendance(s._id)}
                >
                  Save
                </button>
              </div>

              {/* LECTURE DOTS */}
              <div className="mt-3">
                {Array(6).fill(0).map((_, i) => {
                  const status = lectureStatus[s._id]?.[i] || "Present";

                  return (
                    <span
                      key={i}
                      onClick={() => toggleStatus(s._id, i)}
                      style={{
                        display: "inline-block",
                        width: "20px",
                        height: "20px",
                        marginRight: "8px",
                        borderRadius: "50%",
                        cursor: "pointer",
                        background: status === "Present" ? "#2ecc71" : "#8b0000",
                        transition: "0.2s",
                      }}
                    ></span>
                  );
                })}
              </div>

            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
