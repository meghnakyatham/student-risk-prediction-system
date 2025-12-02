import { useEffect, useState } from "react";
import axios from "axios";

export default function StudentRisk() {
  const [data, setData] = useState(null);

  const getColor = (level) => {
    if (level === "High") return "status-red";
    if (level === "Medium") return "status-yellow";
    return "status-green";
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    axios
      .get(`http://localhost:5000/api/students/${user._id}`)
      .then((res) => setData(res.data))
      .catch((err) => console.error("Failed to load risk", err));
  }, []);

  if (!data)
    return <div className="p-4">Loading...</div>;

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
        <h3 style={{ color: "#7a001e", margin: 0 }}>Risk Assessment</h3>
      </div>

      <div className="chic-card p-4 text-center">
        <h5 className="burgundy-title">Your Risk Level</h5>
        <h1 className={getColor(data.risk)}>{data.risk}</h1>

        <h6 className="mt-3 burgundy-title">Possible Reasons</h6>
        <ul className="text-muted">
          {data.riskReasons?.map((r, i) => (
            <li key={i}>{r}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
