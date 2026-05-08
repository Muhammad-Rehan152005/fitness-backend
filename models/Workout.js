const mongoose = require('mongoose');

// 1. The Blueprint for a Single Set
const setSchema = new mongoose.Schema({
    setNumber: { type: Number, default: 0 }, // Not required — frontend may not send it
    lbs: { type: String, default: '' },
    reps: { type: String, default: '0' },
    completed: { type: Boolean, default: false }
});

const exerciseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  sets: [setSchema],
  // --- NEW PARAMETERS ---
  volume: { type: Number, default: 0 }, 
  prAchieved: { type: Boolean, default: false } 
})

// Inside models/Workout.js
const workoutSchema = new mongoose.Schema({
  // --- NEW: The Nametag ---
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User' // Tells MongoDB this ID belongs to the User database
  },
  // -----------------------
  name: { type: String, required: true }, 
  date: { type: Date, default: Date.now }, 
  duration: { type: String, default: '0m' },
  totalVolume: { type: Number, default: 0 },
  prAchieved: { type: Boolean, default: false },
  exercises: [exerciseSchema]
}, { 
  timestamps: true 
});

// Compile the schema into a powerful Model and export it
module.exports = mongoose.model('Workout', workoutSchema);