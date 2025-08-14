const express = require('express');
const router = express.Router();
const multer = require('multer');
const Course = require('../models/Course');
const { authenticateToken } = require('../middleware/authMiddleware');

// Multer setup for memory storage (Buffer)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// CREATE a course (Admin only)
router.post('/', authenticateToken, (req, res, next) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden: Admins only.' });
  next();
}, upload.single('image'), async (req, res) => {
  try {
    const { name, description } = req.body;
    let image = undefined;
    if (req.file) {
      image = {
        data: req.file.buffer,
        contentType: req.file.mimetype
      };
    }
    const course = new Course({ name, description, image });
    await course.save();
    res.status(201).json({ message: 'Course created', course });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// UPDATE a course (Admin only)
router.put('/:id', authenticateToken, (req, res, next) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden: Admins only.' });
  next();
}, upload.single('image'), async (req, res) => {
  try {
    const { name, description } = req.body;
    const updateData = { name, description };
    if (req.file) {
      updateData.image = {
        data: req.file.buffer,
        contentType: req.file.mimetype
      };
    }
    const course = await Course.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!course) return res.status(404).json({ message: 'Course not found' });
    res.status(200).json({ message: 'Course updated', course });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// DELETE a course (Admin only)
router.delete('/:id', authenticateToken, (req, res, next) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden: Admins only.' });
  next();
}, async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    res.status(200).json({ message: 'Course deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// READ all courses (Public)
router.get('/', async (req, res) => {
  try {
    const courses = await Course.find();
    // Convert image buffer to base64 string for each course
    const coursesWithImages = courses.map(course => {
      let imageBase64 = null;
      if (course.image && course.image.data) {
        imageBase64 = `data:${course.image.contentType};base64,${course.image.data.toString('base64')}`;
      }
      return {
        _id: course._id,  
        name: course.name,
        description: course.description,
        imageBase64
      };
    });
    res.status(200).json(coursesWithImages);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// READ single course (Public)
router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    let imageBase64 = null;
    if (course.image && course.image.data) {
      imageBase64 = `data:${course.image.contentType};base64,${course.image.data.toString('base64')}`;
    }
    res.status(200).json({
      _id: course._id,
      name: course.name,
      description: course.description,
      imageBase64
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

module.exports = router;