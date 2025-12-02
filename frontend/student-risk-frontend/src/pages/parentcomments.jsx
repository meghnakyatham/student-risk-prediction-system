import { useEffect, useState } from "react";
import axios from "axios";

export default function ParentComments() {
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const parent = JSON.parse(localStorage.getItem("user"));
    if (!parent?._id) return;

    axios
      .get(`http://localhost:5000/api/parents/dashboard/${parent._id}`)
      .then((res) => {
        const arr = res.data?.comments || [];
        // we assume comments are strings
        const mapped = arr.map((text) => ({
          text,
          teacher: "Teacher",
          date: "",
        }));
        setComments(mapped);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

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
        <h3 style={{ color: "#7a001e", margin: 0 }}>Teacher Comments</h3>
        <p className="text-muted">View what teachers have observed about your child</p>
      </div>

      {/* COMMENT LIST */}
      <div className="chic-card p-4">
        {comments.length === 0 ? (
          <p className="text-muted">No comments available.</p>
        ) : (
          comments.map((c, index) => (
            <div
              key={index}
              style={{
                background: "white",
                padding: "1rem 1.2rem",
                borderRadius: "12px",
                boxShadow: "0 6px 16px rgba(0,0,0,0.08)",
                marginBottom: "1rem",
              }}
            >
              <h6 className="burgundy-title mb-1">{c.teacher}</h6>
              <p style={{ margin: 0 }}>{c.text}</p>
              {c.date && <small className="text-muted">{c.date}</small>}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

