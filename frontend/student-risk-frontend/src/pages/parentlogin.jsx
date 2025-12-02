import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function ParentLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
        role: "parent",
      });

      if (!res.data.user || res.data.user.role !== "parent") {
        alert("Not a parent account");
        return;
      }

      localStorage.setItem("token", res.data.token || "");
      localStorage.setItem("user", JSON.stringify(res.data.user));
      localStorage.setItem("parent", JSON.stringify(res.data.user)); // for existing code

      navigate("/parent/dashboard");
    } catch (err) {
      console.error(err);
      alert("Invalid parent credentials");
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ height: "100vh", background: "#f7f3ec" }}
    >
      <div
        className="p-5 chic-card"
        style={{ width: "400px", background: "white", borderRadius: "16px" }}
      >
        <h3 className="burgundy-title mb-4 text-center">Parent Login</h3>

        <form onSubmit={handleLogin}>
          <input
            type="email"
            className="form-control mb-3"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            className="form-control mb-4"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            className="btn btn-primary w-100"
            style={{ background: "#7a001e", border: "none" }}
            type="submit"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
