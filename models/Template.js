const mongoose = require('mongoose');

const templateExerciseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  defaultSets: { type: Number, default: 3 }, // E.g., Default to 3 sets
  defaultReps: { type: String, default: '10' } // E.g., Default to 10 reps
});

const templateSchema = new mongoose.Schema({
  // Security: Tie the template to the specific user!
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  name: { type: String, required: true }, // e.g., "Heavy Pull Day"
  exercises: [templateExerciseSchema]
}, { timestamps: true });

module.exports = mongoose.model('Template', templateSchema);