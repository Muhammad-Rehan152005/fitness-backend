const mongoose = require('mongoose');

// 1. The Blueprint for a Single Set
const setSchema = new mongoose.Schema({
    setNumber: { type: Number, required: true },
    lbs: { type: String, default: '' },
    reps: { type: String, required: true },
    completed: { type: Boolean, default: false }
});

// 2. The Blueprint for an Exercise (Contains an array of Sets)
const exerciseSchema = new mongoose.Schema({
    name: { type: String, required: true },
    sets: [setSchema]
});

// 3. The Main Blueprint for the entire Workout Session
const workoutSchema = new mongoose.Schema({
    name: { type: String, required: true }, // e.g., "Heavy Push Day"
    date: { type: Date, default: Date.now }, // Automatically stamps the current time
    duration: { type: String, default: '0m' },
    totalVolume: { type: Number, default: 0 },
    exercises: [exerciseSchema]
}, {
    timestamps: true // Automatically adds createdAt and updatedAt fields
});

// Compile the schema into a powerful Model and export it
module.exports = mongoose.model('Workout', workoutSchema);