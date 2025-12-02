const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

  student: { type: mongoose.Schema.Types.ObjectId, ref: 'StudentProfile' },

  text: { type: String, required: true },

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Comment', CommentSchema);
