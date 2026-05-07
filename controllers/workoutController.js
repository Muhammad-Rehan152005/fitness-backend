// Import the Blueprint we just created
const Workout = require('../models/Workout');

const createWorkout = async (req, res) => {
  try {
    const { name, duration, exercises } = req.body;
    
    let totalWorkoutVolume = 0;
    let workoutHasPR = false; 

    // Because we need to ask MongoDB questions for each exercise, we use Promise.all
    const processedExercises = await Promise.all(exercises.map(async (ex) => {
        let exerciseVolume = 0;

        // 1. Calculate Volume for this specific exercise
        const validSets = ex.sets.filter(set => set.reps !== '');
        validSets.forEach(set => {
            if (set.completed && set.lbs && set.reps) {
                exerciseVolume += (parseInt(set.lbs) * parseInt(set.reps));
            }
        });

        totalWorkoutVolume += exerciseVolume;
        let isPR = false;

        // 2. THE PR ENGINE 🏆
        if (exerciseVolume > 0) {
            // Find all historic workouts from the vault that included this exact exercise
            const pastWorkouts = await Workout.find({ "exercises.name": ex.name });

            // What was their highest volume ever?
            let previousMaxVolume = 0;
            pastWorkouts.forEach(workout => {
                const pastExercise = workout.exercises.find(e => e.name === ex.name);
                if (pastExercise && pastExercise.volume > previousMaxVolume) {
                    previousMaxVolume = pastExercise.volume;
                }
            });

            // The Logic: If today beats the historic max, OR if it's their very first time doing it!
            if (pastWorkouts.length === 0) {
                isPR = true; // First time is always a PR!
                workoutHasPR = true;
            } else if (exerciseVolume > previousMaxVolume) {
                isPR = true; // They beat their old record!
                workoutHasPR = true;
            }
        }

        return {
            name: ex.name,
            sets: validSets,
            volume: exerciseVolume, 
            prAchieved: isPR // Save the PR status to the database!
        };
    }));

    // Filter out any exercises that had 0 valid sets
    const finalExercises = processedExercises.filter(ex => ex.sets.length > 0);

    // 3. Assemble and Save
    const newWorkout = new Workout({
        name: name || "Heavy Push Day",
        duration: duration,
        totalVolume: totalWorkoutVolume,
        prAchieved: workoutHasPR, // If even ONE exercise was a PR, the whole workout gets a badge
        exercises: finalExercises
    });

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