const mongoose = require('mongoose');

const studyMaterialSchema = new mongoose.Schema({
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  topicName: { type: String, required: true },
  description: String,
  textContent: String,
  file: {
    data: Buffer,
    contentType: String,
    originalName: String
  }
});

module.exports = mongoose.model('StudyMaterial', studyMaterialSchema);