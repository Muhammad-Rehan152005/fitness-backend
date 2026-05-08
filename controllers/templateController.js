const Template = require('../models/Template');

// 1. CREATE A TEMPLATE
const createTemplate = async (req, res) => {
  try {
    const { name, exercises } = req.body;

    const newTemplate = new Template({
      user: req.user._id, // Attach the JWT wristband ID
      name,
      exercises
    });

    const savedTemplate = await newTemplate.save();
    res.status(201).json(savedTemplate);
  } catch (error) {
    console.error("Error creating template:", error);
    res.status(400).json({ message: 'Failed to create template', error: error.message });
  }
};

// 2. GET ALL TEMPLATES FOR A USER
const getTemplates = async (req, res) => {
  try {
    // Only fetch templates that belong to the logged-in user
    const templates = await Template.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(templates);
  } catch (error) {
    console.error("Error fetching templates:", error);
    res.status(500).json({ message: 'Server Error fetching templates' });
  }
};

module.exports = { createTemplate, getTemplates };