const router = require('express').Router();
const auth = require('../middleware/auth');
const { getHistory, toggleHabit } = require('../controllers/historyController');

// All history routes require authentication
router.use(auth);

router.get('/',                     getHistory);   // GET /api/history
router.put('/:dateKey/:habitId',    toggleHabit);  // PUT /api/history/:dateKey/:habitId

module.exports = router;