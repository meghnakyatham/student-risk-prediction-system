import axios from "axios";
import { useEffect, useState } from "react";

export default function TeacherStudents() {
  const [students, setStudents] = useState([]);
  const [aiSummary, setAiSummary] = useState([]);


  useEffect(() => {
    axios.get("http://localhost:5000/api/students")
      .then((res) => {
        console.log("Students fetched:", res.data);   // ⭐ Debug output
        setStudents(res.data);
      })
      .catch((err) => {
        console.error(err);
        alert("Failed to load students.");
      });

          // ⭐ Fetch AI summary for teacher
    axios.get("http://localhost:5000/api/teachers/ai-summary/all")
      .then((res) => {
        console.log("AI Summary:", res.data);
        setAiSummary(res.data);
      })
      .catch((err) => console.error("AI summary error:", err));

  }, []);



  return (
    <div className="p-4" style={{ background: "#f7f3ec", minHeight: "100vh" }}>
      <h3 style={{ color: "#7a001e" }}>All Students</h3>
      <p className="text-muted">Viewing all seeded student records</p>

      <div className="chic-card p-3">
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Attendance</th>
              <th>Behavior</th>
              <th>Knowledge</th>
              <th>Assignments Due</th>
              <th>Risk</th>
            </tr>
          </thead>

          <tbody>
            {students.map((s, idx) => (
              <tr key={s._id}>
                <td>{idx + 1}</td>
                <td>{s.name}</td>
                <td>{s.email}</td>
                <td>{s.attendance}%</td>
                <td>{s.behavior}</td>
                <td>{s.knowledge}</td>
                <td>{s.assignmentsDue}</td>
                <td>{aiSummary
                .filter((a) => a._id === s._id)
                .map((a) => (
                <div key={a._id} style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                  {/* Academic Risk */}
                  <span
          className="badge"
          style={{
            background: a.academicRisk === "High" ? "#b30000" :
                        a.academicRisk === "Medium" ? "#e6b800" :
                        "#398439",
            color: "white",
            borderRadius: "6px",
            padding: "4px",
            width: "110px",
            textAlign: "center"
          }}
        >
          Academic: {a.academicRisk}
        </span>

        {/* Attendance Risk */}
        <span
          className="badge"
          style={{
            background: a.attendanceRisk === "High" ? "#b30000" :
                        a.attendanceRisk === "Medium" ? "#e6b800" :
                        "#398439",
            color: "white",
            borderRadius: "6px",
            padding: "4px",
            width: "110px",
            textAlign: "center"
          }}
        >
          Attendance: {a.attendanceRisk}
        </span>

        {/* Behavior Risk */}
        <span
          className="badge"
          style={{
            background: a.behaviorRisk === "High" ? "#b30000" :
                        a.behaviorRisk === "Medium" ? "#e6b800" :
                        "#398439",
            color: "white",
            borderRadius: "6px",
            padding: "4px",
            width: "110px",
            textAlign: "center"
          }}
        >
          Behavior: {a.behaviorRisk}
        </span>

        {/* View Full AI Button */}
        <button
          className="btn btn-sm mt-1"
          style={{
            background: "#7a001e",
            color: "white",
            borderRadius: "6px",
            padding: "5px"
          }}
          onClick={() => (window.location.href = `/teacher/ai/${s._id}`)}
        >
          View Full AI
        </button>
      </div>
    ))}
</td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
