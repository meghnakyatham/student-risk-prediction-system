import { useEffect, useState } from "react";

export default function TeacherComments() {
  const [comments, setComments] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    // TEMP DATA — replace with backend later
    const mock = [
      {
        student: "Aarav",
        text: "Needs improvement in algebra fundamentals.",
        date: "2025-02-01",
      },
      {
        student: "Riya",
        text: "Shows good class participation and consistency.",
        date: "2025-01-28",
      },
      {
        student: "Kabir",
        text: "Struggles with attention in class. Counseling recommended.",
        date: "2025-01-20",
      },
    ];

    setComments(mock);
  }, []);

  const deleteComment = (index) => {
    if (confirm("Are you sure you want to delete this comment?")) {
      const updated = comments.filter((_, i) => i !== index);
      setComments(updated);
    }
  };

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
        <h3 style={{ color: "#7a001e", margin: 0 }}>All Comments</h3>
        <p className="text-muted">View comments added to all students</p>
      </div>

      {/* SEARCH BAR */}
      <div className="chic-card p-4 mb-4">
        <h5 className="burgundy-title">Search Comments</h5>
        <input
          type="text"
          className="form-control mt-2"
          placeholder="Search by student name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* COMMENTS LIST */}
      <div className="chic-card p-4">
        <h5 className="burgundy-title mb-3">Comment History</h5>

        {comments
          .filter((c) =>
            c.student.toLowerCase().includes(search.toLowerCase())
          )
          .map((c, index) => (
            <div
              key={index}
              style={{
                background: "white",
                padding: "1rem",
                borderRadius: "12px",
                boxShadow: "0 6px 16px rgba(0,0,0,0.08)",
                marginBottom: "1rem",
              }}
            >
              <div className="d-flex justify-content-between align-items-start">
                
                <div>
                  <h6 className="burgundy-title mb-1">{c.student}</h6>
                  <p style={{ margin: 0 }}>{c.text}</p>
                  <small className="text-muted">{c.date}</small>
                </div>

                <button
                  className="btn btn-sm"
                  style={{
                    background: "#7a001e",
                    color: "white",
                    height: "35px",
                  }}
                  onClick={() => deleteComment(index)}
                >
                  Delete
                </button>

              </div>
            </div>
          ))}

        {comments.filter((c) =>
          c.student.toLowerCase().includes(search.toLowerCase())
        ).length === 0 && (
          <p className="text-muted">No comments found.</p>
        )}

      </div>
    </div>
  );
}
