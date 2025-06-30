const express = require('express');
const router = express.Router();
const multer = require('multer');
const StudyMaterial = require('../models/StudyMaterial');
const Course = require('../models/Course');
const { authenticateToken } = require('../middleware/authMiddleware');

// Multer setup for file upload (pdf/photo)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// CREATE study material (Admin only)
router.post('/', authenticateToken, (req, res, next) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden: Admins only.' });
  next();
}, upload.single('file'), async (req, res) => {
  try {
    const { courseId, topicName, description, textContent } = req.body;
    if (!await Course.findById(courseId)) return res.status(400).json({ message: 'Invalid courseId' });

    let file = undefined;
    if (req.file) {
      file = {
        data: req.file.buffer,
        contentType: req.file.mimetype,
        originalName: req.file.originalname
      };
    }
    const material = new StudyMaterial({ courseId, topicName, description, textContent, file });
    await material.save();
    res.status(201).json({ message: 'Study material created', material });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// UPDATE study material (Admin only)
router.put('/:id', authenticateToken, (req, res, next) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden: Admins only.' });
  next();
}, upload.single('file'), async (req, res) => {
  try {
    const { topicName, description, textContent, courseId } = req.body;
    const updateData = { topicName, description, textContent, courseId };
    if (req.file) {
      updateData.file = {
        data: req.file.buffer,
        contentType: req.file.mimetype,
        originalName: req.file.originalname
      };
    }
    const material = await StudyMaterial.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!material) return res.status(404).json({ message: 'Study material not found' });
    res.status(200).json({ message: 'Study material updated', material });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// DELETE study material (Admin only)
router.delete('/:id', authenticateToken, (req, res, next) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden: Admins only.' });
  next();
}, async (req, res) => {
  try {
    const material = await StudyMaterial.findByIdAndDelete(req.params.id);
    if (!material) return res.status(404).json({ message: 'Study material not found' });
    res.status(200).json({ message: 'Study material deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// READ all study materials for a course (Public)
router.get('/course/:courseId', async (req, res) => {
  try {
    // Populate courseId to get course name
    const materials = await StudyMaterial.find({ courseId: req.params.courseId })
      .populate('courseId', 'name');
    const materialsWithFile = materials.map(mat => {
      let fileBase64 = null;
      if (mat.file && mat.file.data) {
        fileBase64 = `data:${mat.file.contentType};base64,${mat.file.data.toString('base64')}`;
      }
      return {
        _id: mat._id,
        courseId: mat.courseId?._id,
        courseName: mat.courseId?.name, // <-- Add this line
        topicName: mat.topicName,
        description: mat.description,
        textContent: mat.textContent,
        fileBase64,
        fileType: mat.file?.contentType,
        fileName: mat.file?.originalName
      };
    });
    res.status(200).json(materialsWithFile);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// READ single study material (Public)
router.get('/:id', async (req, res) => {
  try {
    const mat = await StudyMaterial.findById(req.params.id);
    if (!mat) return res.status(404).json({ message: 'Study material not found' });
    let fileBase64 = null;
    if (mat.file && mat.file.data) {
      fileBase64 = `data:${mat.file.contentType};base64,${mat.file.data.toString('base64')}`;
    }
    res.status(200).json({
      _id: mat._id,
      courseId: mat.courseId,
      topicName: mat.topicName,
      description: mat.description,
      textContent: mat.textContent,
      fileBase64,
      fileType: mat.file?.contentType,
      fileName: mat.file?.originalName
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

module.exports = router;