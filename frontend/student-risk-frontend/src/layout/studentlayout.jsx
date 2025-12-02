export default function StudentLayout({ children, active }) {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="d-flex" style={{ height: "100vh", backgroundColor: "#f7f3ec" }}>

      {/* SIDEBAR */}
      <div className="sidebar fade">

        <h3 className="sidebar-title">STUDENT PORTAL</h3>

        <div style={{ opacity: 0.9 }}>
          <p className="mb-1">Logged in as:</p>
          <h5 style={{ fontWeight: "600" }}>{user?.name}</h5>
          <small>{user?.email}</small>
        </div>

        <div style={{ borderTop: "1px solid #ffffff55", paddingTop: "1rem" }}>

          <p
            className={`sidebar-item ${active === "dashboard" ? "sidebar-active" : ""}`}
            onClick={() => (window.location.href = "/student/dashboard")}
          >
            Dashboard
          </p>

          <p
            className={`sidebar-item ${active === "attendance" ? "sidebar-active" : ""}`}
            onClick={() => (window.location.href = "/student/attendance")}
          >
            Attendance
          </p>

          <p
            className={`sidebar-item ${active === "assignments" ? "sidebar-active" : ""}`}
            onClick={() => (window.location.href = "/student/assignments")}
          >
            Assignments
          </p>

          <p
            className={`sidebar-item ${active === "comments" ? "sidebar-active" : ""}`}
          >
            Comments
          </p>

          <p
            className={`sidebar-item ${active === "risk" ? "sidebar-active" : ""}`}
          >
            Risk Factor
          </p>

        </div>
      </div>

      {/* CONTENT AREA */}
      <div className="flex-grow-1 p-4">
        {children}
      </div>

    </div>
  );
}
