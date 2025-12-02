const mongoose = require('mongoose');

const StudentProfileSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },

  rollNumber: { type: String },
  className: { type: String },

  cgpa: { type: Number, default: 0 },

  subjects: { type: [String], default: [] },

  needsCounseling: { type: Boolean, default: false }

}, { timestamps: true });

module.exports = mongoose.model('StudentProfile', StudentProfileSchema);
