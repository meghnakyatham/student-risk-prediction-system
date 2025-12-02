// import { useEffect, useState } from "react";
// import axios from "axios";

// export default function StudentCalendar() {
//   const user = JSON.parse(localStorage.getItem("user"));

//   const [calendar, setCalendar] = useState([]);
//   const [records, setRecords] = useState([]);
//   const [selectedDay, setSelectedDay] = useState(null);
//   const [dailyLectures, setDailyLectures] = useState([]);

//   const today = new Date();
//   const year = today.getFullYear();
//   const month = today.getMonth() + 1;

//   // Fetch calendar layout
//   useEffect(() => {
//     axios
//       .get(`http://localhost:5000/api/calendar/${year}/${month}`)
//       .then((res) => setCalendar(res.data))
//       .catch((err) => console.error(err));
//   }, []);

//   // Fetch attendance records
//   useEffect(() => {
//     axios
//       .get(`http://localhost:5000/api/lectures/month/${user._id}/${year}/${month}`)
//       .then((res) => setRecords(res.data))
//       .catch((err) => console.error(err));
//   }, []);

//   const getDayColor = (day) => {
//     const dateStr = `${year}-${month.toString().padStart(2, "0")}-${day
//       .toString()
//       .padStart(2, "0")}`;

//     const rec = records.find((r) => r.date === dateStr);
//     if (!rec) return "text-muted";

//     const total = rec.lectures.length;
//     const present = rec.lectures.filter((l) => l.status === "Present").length;

//     if (present === 0) return "status-red";
//     if (present < total) return "status-yellow";
//     return "status-green";
//   };

//   const openDayLectures = (day) => {
//     setSelectedDay(day);

//     const dateStr = `${year}-${month.toString().padStart(2, "0")}-${day
//       .toString()
//       .padStart(2, "0")}`;
//     const rec = records.find((r) => r.date === dateStr);

//     setDailyLectures(rec ? rec.lectures : []);
//   };

//   return (
//     <div className="p-4" style={{ background: "#f7f3ec", minHeight: "100vh" }}>
//       <h3 style={{ color: "#7a001e" }}>Lecture Calendar</h3>
//       <p className="text-muted">View daily lecture attendance</p>

//       {/* Calendar */}
//       <div className="chic-card p-4">
//         <h4 className="burgundy-title mb-3">
//           {today.toLocaleString("default", { month: "long" })} {year}
//         </h4>

//         <div className="calendar-grid">
//           {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
//             <div className="calendar-header" key={d}>
//               {d}
//             </div>
//           ))}

//           {calendar.flat().map((day, idx) => (
//             <div
//               key={idx}
//               className="calendar-cell"
//               onClick={() => day && openDayLectures(day)}
//             >
//               {day && (
//                 <span className={getDayColor(day)} style={{ fontWeight: "600" }}>
//                   {day}
//                 </span>
//               )}
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Modal */}
//       {selectedDay && (
//         <div className="modal-overlay" onClick={() => setSelectedDay(null)}>
//           <div className="modal-content chic-card p-4" onClick={(e) => e.stopPropagation()}>
//             <h4 className="burgundy-title mb-3">
//               Lectures for {selectedDay}
//             </h4>

//             {dailyLectures.length === 0 ? (
//               <p>No records.</p>
//             ) : (
//               <ul>
//                 {dailyLectures.map((lec, i) => (
//                   <li key={i}>
//                     <strong>{lec.subject}</strong> — {lec.time} →{" "}
//                     {lec.status === "Present" ? "🟢 Present" : "🔴 Absent"}
//                   </li>
//                 ))}
//               </ul>
//             )}

//             <button
//               className="btn btn-dark mt-3"
//               style={{ background: "#7a001e" }}
//               onClick={() => setSelectedDay(null)}
//             >
//               Close
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
