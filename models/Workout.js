const mongoose = require('mongoose');

// 1. The Blueprint for a Single Set
const setSchema = new mongoose.Schema({
    setNumber: { type: Number, required: true },
    lbs: { type: String, default: '' },
    reps: { type: String, required: true },
    completed: { type: Boolean, default: false }
});

const exerciseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  sets: [setSchema],
  // --- NEW PARAMETERS ---
  volume: { type: Number, default: 0 }, 
  prAchieved: { type: Boolean, default: false } 
})

const workoutSchema = new mongoose.Schema({
  name: { type: String, required: true }, 
  date: { type: Date, default: Date.now }, 
  duration: { type: String, default: '0m' },
  // --- NEW PARAMETERS ---
  totalVolume: { type: Number, default: 0 },
  prAchieved: { type: Boolean, default: false },
  exercises: [exerciseSchema]
}, { 
  timestamps: true 
});

// Compile the schema into a powerful Model and export it
module.exports = mongoose.model('Workout', workoutSchema);