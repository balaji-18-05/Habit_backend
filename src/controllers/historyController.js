const History = require('../models/History');

// GET /api/history  →  { "YYYY-MM-DD": ["habitId", ...], ... }
const getHistory = async (req, res, next) => {
  try {
    const records = await History.find({ userId: req.userId });
    const map = {};
    records.forEach((r) => { map[r.dateKey] = r.habitIds; });
    res.json(map);
  } catch (error) {
    next(error);
  }
};

// PUT /api/history/:dateKey/:habitId  →  toggle completion
const toggleHabit = async (req, res, next) => {
  try {
    const { dateKey, habitId } = req.params;

    // Basic date format validation
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateKey)) {
      const err = new Error('dateKey must be in YYYY-MM-DD format');
      err.statusCode = 400;
      return next(err);
    }

    const doc = await History.findOne({ userId: req.userId, dateKey });

    if (!doc) {
      // First completion for this day
      await History.create({ userId: req.userId, dateKey, habitIds: [habitId] });
    } else if (doc.habitIds.includes(habitId)) {
      // Uncomplete
      doc.habitIds = doc.habitIds.filter((id) => id !== habitId);
      await doc.save();
    } else {
      // Complete
      doc.habitIds.push(habitId);
      await doc.save();
    }

    res.json({ ok: true });
  } catch (error) {
    next(error);
  }
};

module.exports = { getHistory, toggleHabit };
