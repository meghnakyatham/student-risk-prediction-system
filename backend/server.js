require("dotenv").config();
const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const connectDB = require("./config/db");


// Import ROUTES
const authRoutes = require("./routes/auth");
const studentRoutes = require("./routes/studentroutes");
const teacherRoutes = require("./routes/teacherroutes");
const parentRoutes = require("./routes/parentroutes");
const SubjectAttendanceRoutes = require("./routes/SubjectAttendanceRoutes");



const app = express();
const server = http.createServer(app);

// SOCKET IO
const io = new Server(server, {
  cors: { origin: "*" }
});

// CONNECT DB
connectDB();

// MIDDLEWARE
app.use(cors());
app.use(express.json());
const workflowLogger = require("./middleware/logMiddleware");
app.use(workflowLogger);


// ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/lectures", require("./routes/lectureAttendanceRoutes"));
app.use("/api/teachers", teacherRoutes);
app.use("/api/parents", parentRoutes);
app.use("/api/parents", require("./routes/parentroutes"));
const lectureAttendanceRoutes = require("./routes/lectureAttendanceRoutes");
const aiRoutes = require("./routes/aiRoutes");
const calendarRoutes = require("./routes/calendarRoutes");
const lectureRoutes = require("./routes/lectureRoutes");
app.use("/api/calendar", calendarRoutes);
app.use("/api/lectures", lectureRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/sub-attendance", SubjectAttendanceRoutes);
app.use("/api/calendar", require("./routes/calendarRoutes"));




// SIMPLE TEST ROUTE
app.get("/", (req, res) => {
  res.send("Backend is running!");
});

// SOCKET CONNECTION
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);
});

// START SERVER
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
