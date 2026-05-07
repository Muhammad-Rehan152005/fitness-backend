const express = require('express');
const router = express.Router();
const { createWorkout, getWorkouts } = require('../controllers/workoutController');

// 1. Import the Bouncer
const { protect } = require('../middleware/authMiddleware');

// 2. Put the bouncer in front of the doors!
// Notice how `protect` sits right in the middle. 
router.post('/', protect, createWorkout);
router.get('/', protect, getWorkouts);

module.exports = router;