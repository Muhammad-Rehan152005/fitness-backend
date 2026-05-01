// Import the Blueprint we just created
const Workout = require('../models/Workout');

// 1. SAVE WORKOUT: Takes data from the app and saves it to MongoDB
const createWorkout = async (req, res) => {
    try {
        // req.body contains the JSON data sent from your React Native app
        const newWorkout = new Workout(req.body);
        const savedWorkout = await newWorkout.save(); // Pushes it to the cloud

        // Respond back to the app with a success status and the saved data
        res.status(201).json(savedWorkout);
    } catch (error) {
        console.error("Error saving workout:", error);
        res.status(400).json({ message: 'Failed to save workout', error: error.message });
    }
};

// 2. GET HISTORY: Fetches all saved workouts to show on the History Tab
const getWorkouts = async (req, res) => {
    try {
        // Finds all workouts and sorts them by date (newest first)
        const workouts = await Workout.find().sort({ createdAt: -1 });
        res.status(200).json(workouts);
    } catch (error) {
        console.error("Error fetching history:", error);
        res.status(500).json({ message: 'Server Error fetching workouts' });
    }
};

// Export these functions so our routes can use them
module.exports = {
    createWorkout,
    getWorkouts
};