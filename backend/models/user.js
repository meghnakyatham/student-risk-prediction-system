const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["student", "teacher", "parent"],
    required: true,
  },

  // 🔽 Academic fields for students
  attendance: {
    type: Number,
    default: 0,       // percentage
  },
  behavior: {
    type: Number,
    default: 0,       // 0–100
  },
  knowledge: {
    type: Number,
    default: 0,       // 0–100
  },
  assignmentsDue: {
    type: Number,
    default: 0,
  },
  risk: {
    type: String,
    enum: ["Low", "Medium", "High"],
    default: "Low",
  },
  comments: {
    type: [String],
    default: [],
  },
  counselingRequired: {
    type: Boolean,
    default: false,
  },

    // --- Performance fields ---
  marks: {
    type: [
      {
        subject: String,
        score: Number,   // e.g., 85 out of 100
      },
    ],
    default: [],
  },
  cgpaHistory: {
    type: [
      {
        semester: String, // e.g., "Sem 1"
        cgpa: Number,     // e.g., 7.8
      },
    ],
    default: [],
  },

});

module.exports = mongoose.model("User", userSchema);

