import { useEffect, useState } from "react";
import axios from "axios";

export default function StudentAssignments() {
  const [assignments, setAssignments] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/assignments")
      .then((res) => setAssignments(res.data))
      .catch((err) => console.error("Failed to load assignments", err));
  }, []);

  return (
    <div className="p-4" style={{ background: "#f7f3ec", minHeight: "100vh" }}>
      <div
        style={{
          background: "white",
          padding: "1.2rem 1.5rem",
          borderRadius: "16px",
          boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
          marginBottom: "2rem",
        }}
      >
        <h3 style={{ color: "#7a001e", margin: 0 }}>Assignments</h3>
        <p className="text-muted">Check your pending assignments</p>
      </div>

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
              <button className="btn btn-burgundy mt-2">View Details</button>
            </div>
          </div>
        ))}

        {assignments.length === 0 && (
          <p className="text-muted text-center">No assignments available.</p>
        )}
      </div>
    </div>
  );
}
