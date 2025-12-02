const mongoose = require("mongoose");

const lectureAttendanceSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  date: {
    type: String,
    required: true
  },
  lectures: [
    {
      time: String,           // ex: "9:00 AM"
      subject: String,        // ex: "Math"
      status: String          // "Present" or "Absent"
    }
  ]
});

module.exports = mongoose.model("LectureAttendance", lectureAttendanceSchema);
