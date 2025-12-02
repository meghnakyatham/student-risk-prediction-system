export default function SelectRole() {
  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{
        height: "100vh",
        background: "#f7f3ec",
      }}
    >
      <div
        style={{
          width: "450px",
          background: "white",
          padding: "2.5rem",
          borderRadius: "20px",
          boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
          textAlign: "center",
        }}
      >
        <h2 className="burgundy-title mb-4">Welcome to Academic Portal</h2>
        <p className="text-muted mb-4">Please select your role to continue</p>

        <button
          className="btn w-100 mb-3"
          style={{
            background: "#7a001e",
            color: "white",
            padding: "12px",
            borderRadius: "10px",
            fontSize: "18px",
          }}
          onClick={() => (window.location.href = "/login")}
        >
          Student Login
        </button>

        <button
          className="btn w-100 mb-3"
          style={{
            background: "#2c2c2c",
            color: "white",
            padding: "12px",
            borderRadius: "10px",
            fontSize: "18px",
          }}
          onClick={() => (window.location.href = "/teacher/login")}
        >
          Teacher Login
        </button>

        <button
          className="btn w-100"
          style={{
            background: "#b48a76",
            color: "white",
            padding: "12px",
            borderRadius: "10px",
            fontSize: "18px",
          }}
          onClick={() => (window.location.href = "/parent/login")}
        >
          Parent Login
        </button>
      </div>
    </div>
  );
}
