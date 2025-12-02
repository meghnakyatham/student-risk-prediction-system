const mongoose = require("mongoose");

const TimetableSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  day: { type: String, required: true }, // "Monday", "Tuesday"
  lectures: [
    {
      start: String,     // "09:00"
      end: String,       // "10:00"
      subject: String,   // "Data Structures"
      faculty: String,   // "Dr Sneha Patil"
      room: String,      // "402"
    }
  ]
});

module.exports = mongoose.model("Timetable", TimetableSchema);
