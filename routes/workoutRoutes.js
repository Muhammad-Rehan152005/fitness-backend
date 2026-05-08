const express = require('express');
const router = express.Router();
const { createWorkout, getWorkouts, getWorkoutById } = require('../controllers/workoutController');

// 1. Import the Bouncer
const { protect } = require('../middleware/authMiddleware');

// 2. Put the bouncer in front of the doors!
router.post('/', protect, createWorkout);
router.get('/', protect, getWorkouts);
router.get('/:id', protect, getWorkoutById); // <-- NEW: fetch one workout by ID

module.exports = router;