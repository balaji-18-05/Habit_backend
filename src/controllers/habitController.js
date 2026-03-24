const Habit = require('../models/Habit');

const toDateKey = (d = new Date()) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

// GET /api/habits
const getHabits = async (req, res, next) => {
  try {
    const habits = await Habit.find({ userId: req.userId, archivedAt: null }).sort({ createdAt: 1 });
    res.json(habits);
  } catch (error) {
    next(error);
  }
};

// POST /api/habits
const createHabit = async (req, res, next) => {
  try {
    const { name, desc, icon, color } = req.body;

    if (!name || !name.trim()) {
      const err = new Error('Habit name is required');
      err.statusCode = 400;
      return next(err);
    }

    const habit = await Habit.create({
      userId: req.userId,
      name: name.trim(),
      desc: desc?.trim() || '',
      icon: icon || '✦',
      color: color || '#ffffff',
      createdAt: toDateKey(),
      archivedAt: null,
    });

    res.status(201).json(habit);
  } catch (error) {
    next(error);
  }
};

// PATCH /api/habits/:id
const updateHabit = async (req, res, next) => {
  try {
    const { name, desc, icon, color } = req.body;
    const updates = {};
    if (name !== undefined) updates.name = name.trim();
    if (desc !== undefined) updates.desc = desc.trim();
    if (icon !== undefined) updates.icon = icon;
    if (color !== undefined) updates.color = color;

    const habit = await Habit.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      updates,
      { new: true, runValidators: true }
    );

    if (!habit) {
      const err = new Error('Habit not found');
      err.statusCode = 404;
      return next(err);
    }

    res.json(habit);
  } catch (error) {
    next(error);
  }
};

// DELETE /api/habits/:id  (soft-delete via archivedAt)
const deleteHabit = async (req, res, next) => {
  try {
    const habit = await Habit.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { archivedAt: toDateKey() },
      { new: true }
    );

    if (!habit) {
      const err = new Error('Habit not found');
      err.statusCode = 404;
      return next(err);
    }

    res.json({ ok: true });
  } catch (error) {
    next(error);
  }
};

module.exports = { getHabits, createHabit, updateHabit, deleteHabit };
