// src/models/trainer.js
const mongoose = require('mongoose');

const TrainerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    education: {
        type: String,
        trim: true
    },
    skills: {
        type: [String], // Array of strings
        default: []
    },
    photo: {
       data: Buffer,
    contentType: String // Not all trainers might have a photo
    },
    courseIds: {
        type: [mongoose.Schema.Types.ObjectId], // Array of ObjectIds referencing Course
        ref: 'Course', // Reference to the Course model
        default: []
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Trainer', TrainerSchema);