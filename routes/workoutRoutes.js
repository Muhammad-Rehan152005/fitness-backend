const express = require('express');
const router = express.Router();

// Import our chef functions from the controller
const { createWorkout, getWorkouts } = require('../controllers/workoutController');

// Define what happens when the frontend visits these URLs
// POST request to /api/workouts -> Saves data
router.post('/', createWorkout);

// GET request to /api/workouts -> Fetches data
router.get('/', getWorkouts);

module.exports = router;