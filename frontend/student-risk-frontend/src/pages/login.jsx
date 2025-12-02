import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const loginUser = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
        role: "student",
      });

      if (!res.data.user || res.data.user.role !== "student") {
        alert("Not a student account");
        return;
      }

      localStorage.setItem("token", res.data.token || "");
      localStorage.setItem("user", JSON.stringify(res.data.user));

      navigate("/student/dashboard");
    } catch (err) {
      console.error(err);
      alert("Invalid Login!");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 fade-in">
      <div className="chic-card" style={{ width: "400px" }}>
        <h2 className="text-center burgundy-title mb-4">Student Portal</h2>
        <p className="text-center text-muted mb-4">Access your academic dashboard</p>

        <label className="fw-semibold burgundy-title">Email</label>
        <input
          type="text"
          className="form-control chic-input mb-3"
          placeholder="student@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label className="fw-semibold burgundy-title">Password</label>
        <input
          type="password"
          className="form-control chic-input mb-4"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="btn btn-burgundy w-100" onClick={loginUser}>
          Sign In
        </button>
      </div>
    </div>
  );
}

