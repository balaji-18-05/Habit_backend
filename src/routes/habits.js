const router = require('express').Router();
const auth = require('../middleware/auth');
const { getHabits, createHabit, updateHabit, deleteHabit } = require('../controllers/habitController');

// All habit routes require authentication
router.use(auth);

router.get('/',     getHabits);     // GET    /api/habits
router.post('/',    createHabit);   // POST   /api/habits
router.patch('/:id', updateHabit); // PATCH  /api/habits/:id
router.delete('/:id', deleteHabit); // DELETE /api/habits/:id

module.exports = router;