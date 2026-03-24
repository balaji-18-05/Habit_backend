const mongoose = require('mongoose');

const habitSchema = new mongoose.Schema({
  userId:    { type: String, required: true, index: true },
  name:      { type: String, required: true },
  desc:      { type: String, default: '' },
  icon:      { type: String, default: '✦' },
  color:     { type: String, default: '#ffffff' },
  createdAt: { type: String, required: true }, // YYYY-MM-DD
  archivedAt:{ type: String, default: null },
}, { timestamps: true });

module.exports = mongoose.model('Habit', habitSchema);