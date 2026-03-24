const mongoose = require('mongoose');

// One document per user-day, holds array of completed habit IDs
const historySchema = new mongoose.Schema({
  userId:    { type: String, required: true, index: true },
  dateKey:   { type: String, required: true },   // YYYY-MM-DD
  habitIds:  [{ type: String }],
}, { timestamps: true });

historySchema.index({ userId: 1, dateKey: 1 }, { unique: true });
module.exports = mongoose.model('History', historySchema);