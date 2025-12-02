import { useEffect, useState } from "react";
import axios from "axios";

export default function StudentComments() {
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    axios
      .get(`http://localhost:5000/api/students/${user._id}`)
      .then((res) => setComments(res.data.comments || []))
      .catch((err) => console.error("Failed to load comments", err));
  }, []);

  return (
    <div className="p-4" style={{ background: "#f7f3ec", minHeight: "100vh" }}>
      <div
        style={{
          background: "white",
          padding: "1.2rem 1.5rem",
          borderRadius: "16px",
          marginBottom: "2rem",
        }}
      >
        <h3 style={{ color: "#7a001e", margin: 0 }}>Teacher Comments</h3>
      </div>

      <div className="chic-card p-4">
        {comments.length === 0 ? (
          <p className="text-muted">No comments yet.</p>
        ) : (
          comments.map((c, i) => (
            <div
              key={i}
              style={{
                background: "white",
                padding: "1rem 1.2rem",
                borderRadius: "12px",
                boxShadow: "0 6px 16px rgba(0,0,0,0.08)",
                marginBottom: "1rem",
              }}
            >
              <p style={{ margin: 0 }}>{c}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

