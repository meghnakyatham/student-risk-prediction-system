import { useState, useEffect } from "react";
import axios from "axios";

export default function TeacherAttendance() {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [subject, setSubject] = useState("");
  const [status, setStatus] = useState("Present");

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/students")
      .then((res) => setStudents(res.data))
      .catch((err) => console.error("Failed to load students", err));
  }, []);

  const markAttendance = async () => {
    if (!selectedStudent || !subject) {
      alert("Please fill all fields");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/teachers/attendance", {
        studentId: selectedStudent,
        subject,
        status,
      });

      alert("Attendance marked successfully");
      setSelectedStudent("");
      setSubject("");
      setStatus("Present");
    } catch (err) {
      console.error(err);
      alert("Failed to mark attendance");
    }
  };

  return (
    <div
      className="p-4"
      style={{ background: "#f7f3ec", minHeight: "100vh" }}
    >
      {/* HEADER */}
      <div
        style={{
          background: "white",
          padding: "1.2rem 1.5rem",
          borderRadius: "16px",
          marginBottom: "2rem",
        }}
      >
        <h3 style={{ color: "#7a001e" }}>Mark Attendance</h3>
        <p className="text-muted">Select a student and mark attendance</p>
      </div>

      {/* FORM */}
      <div className="chic-card p-4 mb-4">
        <h5 className="burgundy-title mb-3">Attendance Form</h5>

        <select
          className="form-control mb-3"
          value={selectedStudent}
          onChange={(e) => setSelectedStudent(e.target.value)}
        >
          <option value="">Select Student</option>
          {students.map((s) => (
            <option key={s._id} value={s._id}>
              {s.name}
            </option>
          ))}
        </select>

        <input
          className="form-control mb-3"
          placeholder="Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />

        <select
          className="form-control mb-3"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="Present">Present</option>
          <option value="Absent">Absent</option>
        </select>

        <button
          className="btn"
          style={{ background: "#7a001e", color: "white" }}
          onClick={markAttendance}
        >
          Submit
        </button>
      </div>
    </div>
  );
}
