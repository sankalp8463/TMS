const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
 image: {
    data: Buffer,
    contentType: String
  }
});

module.exports = mongoose.model('Course', courseSchema);