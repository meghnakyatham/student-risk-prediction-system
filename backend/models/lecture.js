const mongoose = require("mongoose");

const lectureSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  date: { type: String, required: true },
  subject: { type: String, required: true },
  time: { type: String, required: true },
  status: { type: String, enum: ["Present", "Absent"], required: true }
});

module.exports = mongoose.model("Lecture", lectureSchema);
