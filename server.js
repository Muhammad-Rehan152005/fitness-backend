require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose'); // <-- 1. Import Mongoose

const app = express();

app.use(cors());
app.use(express.json());
// --- ADD THESE TWO LINES ---
// Import the routes and tell Express to use them
const workoutRoutes = require('./routes/workoutRoutes');
app.use('/api/workouts', workoutRoutes);
// ---------------------------

// 2. Connect to MongoDB using the secret URI
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('🟢 Successfully connected to MongoDB Atlas!');
    })
    .catch((error) => {
        console.error('🔴 MongoDB connection error:', error);
    });

// A simple test route
app.get('/api/status', (req, res) => {
    res.status(200).json({ message: "Engine is running. Ready to lift." });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});