const mongoose = require('mongoose');

const AttendanceSchema = new mongoose.Schema({
  student: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'StudentProfile' 
  },

  subject: { type: String, required: true },

  date: { type: Date, required: true },

  present: { type: Boolean, required: true }

});

module.exports = mongoose.model('Attendance', AttendanceSchema);
