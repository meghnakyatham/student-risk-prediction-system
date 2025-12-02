import { BrowserRouter, Routes, Route } from "react-router-dom";
import SelectRole from "./pages/selectrole.jsx";
import Login from "./pages/login.jsx";
import Home from "./pages/Home.jsx";
import StudentDashboard from "./pages/studentdashboard.jsx";
import StudentAIAnalysis from "./pages/studentanalysis.jsx";
import StudentAssignments from "./pages/studentassignments";
import StudentAttendance from "./pages/studentattendance";
import StudentComments from "./pages/studentcomments";
import StudentRisk from "./pages/studentrisk";
import TeacherLogin from "./pages/teacherlogin";
import TeacherDashboard from "./pages/teacherdashboard";
import TeacherStudents from "./pages/teacherstudents";
import TeacherLectures from "./pages/teacherLectures"; 
import TeacherLectureAttendance from "./pages/teacherlectureattendance";
import TeacherStudentProfile from "./pages/teacherstudentprofile";
import TeacherAssignments from "./pages/teacherassignments";
import TeacherAttendance from "./pages/teacherattendance";
import TeacherComments from "./pages/teachercomments";
import ParentLogin from "./pages/parentlogin";
import ParentDashboard from "./pages/parentdashboard";
import ParentAttendance from "./pages/parentattendance";
import ParentRisk from "./pages/parentrisk";
import ParentComments from "./pages/parentcomments";
import StudentPerformance from "./pages/studentperformance";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SelectRole />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />

        {/* Student */}
        <Route path="/student/dashboard" element={<StudentDashboard />} />
        <Route path="/student/analysis" element={<StudentAIAnalysis />} />
        <Route path="/student/assignments" element={<StudentAssignments />} />
        <Route path="/student/attendance" element={<StudentAttendance />} />
        <Route path="/student/comments" element={<StudentComments />} />
        <Route path="/student/performance" element={<StudentPerformance />} />
        <Route path="/student/risk" element={<StudentRisk />} />

        {/* Teacher */}
        <Route path="/teacher/login" element={<TeacherLogin />} />
        <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
        <Route path="/teacher/students" element={<TeacherStudents />} />
        <Route path="/teacher/teacherLectures" element={<TeacherLectures />} />
        <Route path="/teacher/lecture-attendance" element={<TeacherLectureAttendance />} />
        <Route path="/teacher/student/:id" element={<TeacherStudentProfile />} />
        <Route path="/teacher/assignments" element={<TeacherAssignments />} />
        <Route path="/teacher/attendance" element={<TeacherAttendance />} />
        <Route path="/teacher/comments" element={<TeacherComments />} />



        {/* Parent */}
        <Route path="/parent/login" element={<ParentLogin />} />
        <Route path="/parent/dashboard" element={<ParentDashboard />} />
        <Route path="/parent/attendance" element={<ParentAttendance />} />
        <Route path="/parent/risk" element={<ParentRisk />} />
        <Route path="/parent/comments" element={<ParentComments />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
