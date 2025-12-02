import axios from "axios";
import { useEffect, useState } from "react";

export default function TeacherLectures() {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [lectureData, setLectureData] = useState([]);
  const [date, setDate] = useState("");
  const [status, setStatus] = useState({});

  // Fetch lecture schedule
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/lectures/schedule")
      .then((res) => setLectureData(res.data))
      .catch((err) => console.error("Schedule error:", err));
  }, []);

  // Fetch students
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/students")
      .then((res) => setStudents(res.data))
      .catch((err) => console.error("Students error:", err));
  }, []);

  const markAttendance = () => {
    if (!selectedStudent || !date) {
      alert("Please select student & date");
      return;
    }

    const lectures = lectureData.map((lec) => ({
      time: lec.time,
      subject: lec.subject,
      status: status[lec.time] || "Absent",
    }));

    axios
      .post("http://localhost:5000/api/lectures/mark", {
        studentId: selectedStudent,
        date,
        lectures,
      })
      .then(() => alert("Lecture attendance saved!"))
      .catch(() => alert("Error saving attendance"));
  };

  return (
    <div className="p-4" style={{ background: "#f7f3ec", minHeight: "100vh" }}>
      <h3 style={{ color: "#7a001e" }}>Lecture Attendance</h3>
      <p className="text-muted">
        Mark attendance for each lecture of the day
      </p>

      <div className="chic-card p-4">
        {/* Select Student */}
        <label className="form-label">Select Student</label>
        <select
          className="form-control mb-3"
          value={selectedStudent}
          onChange={(e) => setSelectedStudent(e.target.value)}
        >
          <option value="">-- Select --</option>
          {students.map((s) => (
            <option key={s._id} value={s._id}>
              {s.name}
            </option>
          ))}
        </select>

        {/* Select Date */}
        <label className="form-label">Select Date</label>
        <input
          type="date"
          className="form-control mb-4"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        <hr />

        {/* Lecture Cards */}
        <h5 className="burgundy-title">Today's Lectures</h5>
        <div className="row g-3">
          {lectureData.map((lec) => (
            <div className="col-md-4" key={lec.time}>
              <div className="p-3 chic-card text-center">
                <h6>{lec.subject}</h6>
                <p className="text-muted">{lec.time}</p>

                <button
                  className={`btn ${
                    status[lec.time] === "Present"
                      ? "btn-success"
                      : "btn-outline-success"
                  } me-2`}
                  onClick={() =>
                    setStatus({ ...status, [lec.time]: "Present" })
                  }
                >
                  Present
                </button>

                <button
                  className={`btn ${
                    status[lec.time] === "Absent"
                      ? "btn-danger"
                      : "btn-outline-danger"
                  }`}
                  onClick={() =>
                    setStatus({ ...status, [lec.time]: "Absent" })
                  }
                >
                  Absent
                </button>
              </div>
            </div>
          ))}
        </div>

        <button
          className="btn btn-dark mt-4"
          style={{ background: "#7a001e" }}
          onClick={markAttendance}
        >
          Save Attendance
        </button>
      </div>
    </div>
  );
}
