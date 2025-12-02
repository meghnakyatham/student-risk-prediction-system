import { useEffect, useState } from "react";
import axios from "axios";

export default function StudentPerformance() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    axios
      .get(`http://localhost:5000/api/students/${user._id}/performance`)
      .then((res) => setData(res.data))
      .catch((err) => console.error("Failed to load performance", err));
  }, []);

  if (!data) return <div className="p-4">Loading...</div>;

  return (
    <div className="p-4" style={{ background: "#f7f3ec", minHeight: "100vh" }}>
      {/* HEADER */}
      <div
        style={{
          background: "white",
          padding: "1.2rem 1.5rem",
          borderRadius: "16px",
          marginBottom: "2rem",
        }}
      >
        <h3 style={{ color: "#7a001e" }}>Performance</h3>
        <p className="text-muted">Your academic marks & CGPA</p>
      </div>

      <div className="row g-4">
        {/* MARKS */}
        <div className="col-md-6">
          <div className="chic-card p-4">
            <h5 className="burgundy-title mb-3">Marks</h5>
            <ul className="text-muted">
              {data.marks?.map((m, i) => (
                <li key={i}>
                  <strong>{m.subject}:</strong> {m.score}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* CGPA */}
        <div className="col-md-6">
          <div className="chic-card p-4">
            <h5 className="burgundy-title mb-3">CGPA History</h5>
            <ul className="text-muted">
              {data.cgpaHistory?.map((c, i) => (
                <li key={i}>
                  {c.semester}: <strong>{c.cgpa}</strong>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

