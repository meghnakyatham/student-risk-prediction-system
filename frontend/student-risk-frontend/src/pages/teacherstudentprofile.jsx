import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function TeacherStudentProfile() {
  const { id } = useParams();

  const [student, setStudent] = useState(null);
  const [newComment, setNewComment] = useState("");
  const [counseling, setCounseling] = useState(false);

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/students/${id}`);
        setStudent(res.data);
        setCounseling(!!res.data.counselingRequired);
      } catch (err) {
        console.error(err);
        alert("Failed to load student data");
      }
    };

    fetchStudent();
  }, [id]);

  const addComment = async () => {
    if (!newComment.trim() || !student) return;

    try {
      const teacher = JSON.parse(localStorage.getItem("user"));

      await axios.post(`http://localhost:5000/api/teachers/${id}/comment`, {
        text: newComment,
        teacherName: teacher?.name || "Teacher",
      });

      setStudent({
        ...student,
        comments: [...(student.comments || []), `${teacher?.name || "Teacher"}: ${newComment}`],
      });

      setNewComment("");
    } catch (err) {
      console.error(err);
      alert("Failed to add comment");
    }
  };

  const saveChanges = async () => {
    if (!student) return;

    try {
      await axios.put(`http://localhost:5000/api/teachers/${id}/update`, {
        attendance: student.attendance,
        behavior: student.behavior,
        knowledge: student.knowledge,
        assignmentsDue: student.assignmentsDue,
        counselingRequired: counseling,
      });

      alert("Saved successfully (risk updated on server)");
    } catch (err) {
      console.error(err);
      alert("Failed to save changes");
    }
  };

  if (!student) return <p className="p-4">Loading...</p>;

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
        <h3 style={{ color: "#7a001e", margin: 0 }}>{student.name}'s Profile</h3>
        <p className="text-muted">Teacher View — Edit Student Data</p>
      </div>

      {/* METRICS */}
      <div className="row g-4">
        <div className="col-md-3">
          <div className="chic-card p-3 text-center">
            <h6 className="burgundy-title">Attendance</h6>
            <input
              type="number"
              className="form-control text-center"
              value={student.attendance}
              onChange={(e) =>
                setStudent({ ...student, attendance: Number(e.target.value) })
              }
            />
          </div>
        </div>

        <div className="col-md-3">
          <div className="chic-card p-3 text-center">
            <h6 className="burgundy-title">Behavior</h6>
            <input
              type="number"
              className="form-control text-center"
              value={student.behavior}
              onChange={(e) =>
                setStudent({ ...student, behavior: Number(e.target.value) })
              }
            />
          </div>
        </div>

        <div className="col-md-3">
          <div className="chic-card p-3 text-center">
            <h6 className="burgundy-title">Knowledge</h6>
            <input
              type="number"
              className="form-control text-center"
              value={student.knowledge}
              onChange={(e) =>
                setStudent({ ...student, knowledge: Number(e.target.value) })
              }
            />
          </div>
        </div>

        <div className="col-md-3">
          <div className="chic-card p-3 text-center">
            <h6 className="burgundy-title">Assignments Due</h6>
            <input
              type="number"
              className="form-control text-center"
              value={student.assignmentsDue}
              onChange={(e) =>
                setStudent({
                  ...student,
                  assignmentsDue: Number(e.target.value),
                })
              }
            />
          </div>
        </div>
      </div>

      {/* COMMENTS */}
      <div className="chic-card p-4 mt-4">
        <h5 className="burgundy-title">Teacher Comments</h5>

        <ul>
          {(student.comments || []).map((c, i) => (
            <li key={i} className="mb-2">
              {c}
            </li>
          ))}
        </ul>

        <textarea
          className="form-control mt-3"
          placeholder="Write a new comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        ></textarea>

        <button
          className="btn mt-3"
          style={{ background: "#7a001e", color: "white" }}
          onClick={addComment}
        >
          Add Comment
        </button>
      </div>

      {/* COUNSELING */}
      <div className="chic-card p-4 mt-4">
        <h5 className="burgundy-title">Counseling Required?</h5>
        <input
          type="checkbox"
          checked={counseling}
          onChange={() => setCounseling(!counseling)}
        />{" "}
        <span className="ms-2">{counseling ? "Yes" : "No"}</span>
      </div>

      {/* SAVE */}
      <button
        className="btn btn-lg mt-4"
        style={{
          background: "#7a001e",
          color: "white",
          width: "100%",
          padding: "12px",
          borderRadius: "12px",
        }}
        onClick={saveChanges}
      >
        Save Changes
      </button>
    </div>
  );
}
