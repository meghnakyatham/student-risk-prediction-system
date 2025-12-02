import { useState, useEffect } from "react";
import axios from "axios";

export default function TeacherAssignments() {
  const [assignments, setAssignments] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    dueDate: "",
    subject: "",
  });

  const teacher = JSON.parse(localStorage.getItem("user"));

  // Load all assignments
  const loadAssignments = () => {
    axios
      .get("http://localhost:5000/api/assignments")
      .then((res) => setAssignments(res.data))
      .catch((err) => console.error("Failed to load assignments", err));
  };

  useEffect(() => {
    loadAssignments();
  }, []);

  // Upload assignment
  const uploadAssignment = async () => {
    if (!form.title || !form.description || !form.dueDate || !form.subject) {
      alert("Please fill all fields");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/teachers/assignment", {
        ...form,
        uploadedBy: teacher?.name || "Teacher",
      });

      alert("Assignment uploaded!");
      setForm({ title: "", description: "", dueDate: "", subject: "" });
      loadAssignments();
    } catch (err) {
      console.error(err);
      alert("Failed to upload assignment");
    }
  };

  return (
    <div className="p-4" style={{ minHeight: "100vh", background: "#f7f3ec" }}>
      {/* HEADER */}
      <div
        style={{
          background: "white",
          padding: "1.2rem 1.5rem",
          borderRadius: "16px",
          marginBottom: "2rem",
          boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
        }}
      >
        <h3 style={{ color: "#7a001e", margin: 0 }}>Teacher Assignments</h3>
        <p className="text-muted">Upload and view assignments</p>
      </div>

      {/* UPLOAD FORM */}
      <div className="chic-card p-4 mb-4">
        <h5 className="burgundy-title mb-3">Upload New Assignment</h5>

        <input
          type="text"
          className="form-control mb-3"
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />

        <textarea
          className="form-control mb-3"
          rows="3"
          placeholder="Description"
          value={form.description}
          onChange={(e) =>
            setForm({ ...form, description: e.target.value })
          }
        ></textarea>

        <input
          type="date"
          className="form-control mb-3"
          value={form.dueDate}
          onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
        />

        <input
          type="text"
          className="form-control mb-3"
          placeholder="Subject"
          value={form.subject}
          onChange={(e) => setForm({ ...form, subject: e.target.value })}
        />

        <button
          className="btn"
          style={{ background: "#7a001e", color: "white" }}
          onClick={uploadAssignment}
        >
          Upload
        </button>
      </div>

      {/* ASSIGNMENTS LIST */}
      <div className="row g-4">
        {assignments.map((a) => (
          <div className="col-md-4" key={a._id}>
            <div className="chic-card p-4">
              <h5 className="burgundy-title">{a.title}</h5>
              <p className="text-muted">{a.description}</p>
              <p>
                <strong>Subject:</strong> {a.subject}
              </p>
              <p>
                <strong>Due:</strong>{" "}
                {new Date(a.dueDate).toLocaleDateString()}
              </p>

              <p>
                <strong>Uploaded By:</strong> {a.uploadedBy}
              </p>
            </div>
          </div>
        ))}

        {assignments.length === 0 && (
          <p className="text-muted text-center">No assignments uploaded yet.</p>
        )}
      </div>
    </div>
  );
}

