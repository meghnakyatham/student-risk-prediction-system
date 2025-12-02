const mongoose = require("mongoose");

const SubjectAttendanceSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  subject: String,
  attended: Number,          // 48
  total: Number,             // 50
});

module.exports = mongoose.model("SubjectAttendance", SubjectAttendanceSchema);
