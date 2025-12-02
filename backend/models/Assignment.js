const mongoose = require('mongoose');

const AssignmentSchema = new mongoose.Schema({
  title: String,
  description: String,
  subject: String,

  dueDate: Date,

  uploader: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  },

  submissions: [{
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'StudentProfile' },
    fileUrl: String,
    submittedAt: Date,
    marks: Number
  }]
});

module.exports = mongoose.model('Assignment', AssignmentSchema);
