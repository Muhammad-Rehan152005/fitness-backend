// Import the Blueprint we just created
const Workout = require('../models/Workout');

// 1. SAVE WORKOUT: Takes data from the app and saves it to MongoDB
const createWorkout = async (req, res) => {
  try {
    // 1. Grab the raw data sent by the mobile app
    const { name, duration, exercises } = req.body;
    
    let totalWorkoutVolume = 0;
    let workoutHasPR = false; // We will build the PR algorithm later!

    // 2. The Backend Engine: Process and calculate everything
    const processedExercises = exercises.map(ex => {
        let exerciseVolume = 0;

        // Filter out any empty sets the user didn't fill in
        const validSets = ex.sets.filter(set => set.reps !== '');

        // Calculate the volume just for this specific exercise
        validSets.forEach(set => {
            if (set.completed && set.lbs && set.reps) {
                exerciseVolume += (parseInt(set.lbs) * parseInt(set.reps));
            }
        });

        // Add this exercise's volume to the grand total
        totalWorkoutVolume += exerciseVolume;

        return {
            name: ex.name,
            sets: validSets,
            volume: exerciseVolume, // Save the calculated volume to the DB
            prAchieved: false       // Placeholder for future PR logic
        };
    }).filter(ex => ex.sets.length > 0); // Don't save exercises with 0 valid sets

    // 3. Assemble the final, perfect package
    const newWorkout = new Workout({
        name: name || "Heavy Push Day",
        duration: duration,
        totalVolume: totalWorkoutVolume,
        prAchieved: workoutHasPR,
        exercises: processedExercises
    });

    // 4. Save to MongoDB
    const savedWorkout = await newWorkout.save(); 
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