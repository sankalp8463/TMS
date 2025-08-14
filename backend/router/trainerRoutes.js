const express = require('express');
const multer = require('multer');
const Trainer = require('../models/trainer');
const Course = require('../models/Course');
const { authenticateToken } = require('../middleware/authMiddleware');

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

// 🔒 Admin-only middleware
const adminOnly = (req, res, next) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden: Admins only.' });
  next();
};

// ✅ CREATE Trainer (admin only)
router.post('/', authenticateToken, adminOnly, upload.single('photo'), async (req, res) => {
  try {
    const { name, education, skills, courseIds } = req.body;
    const parsedSkills = JSON.parse(skills || '[]');
    const parsedCourseIds = JSON.parse(courseIds || '[]');

    // Validate courses exist
    const validCourses = await Course.find({ _id: { $in: parsedCourseIds } });
    if (validCourses.length !== parsedCourseIds.length)
      return res.status(400).json({ message: 'One or more courseIds are invalid.' });

    const trainer = new Trainer({
      name,
      education,
      skills: parsedSkills,
      courseIds: parsedCourseIds,
    });

    if (req.file) {
      trainer.photo = {
        data: req.file.buffer,
        contentType: req.file.mimetype,
      };
    }
    console.log(trainer);
    await trainer.save();
    res.status(201).json({ message: 'Trainer created', trainer });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

router.put('/:id', authenticateToken, adminOnly, upload.single('photo'), async (req, res) => {
  try {
    const { name, education, skills, courseIds, removePhoto } = req.body;
    const trainer = await Trainer.findById(req.params.id);
    if (!trainer) return res.status(404).json({ message: 'Trainer not found' });

    if (name) trainer.name = name;
    if (education) trainer.education = education;
    if (skills) trainer.skills = JSON.parse(skills);
    if (courseIds) trainer.courseIds = JSON.parse(courseIds);

    if (removePhoto === 'true') {
      trainer.photo = undefined;
    } else if (req.file) {
      trainer.photo = {
        data: req.file.buffer,
        contentType: req.file.mimetype,
      };
    }

    await trainer.save();
    res.status(200).json({ message: 'Trainer updated', trainer });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// ✅ DELETE Trainer (admin only)
router.delete('/:id', authenticateToken, adminOnly, async (req, res) => {
  try {
    const trainer = await Trainer.findByIdAndDelete(req.params.id);
    if (!trainer) return res.status(404).json({ message: 'Trainer not found' });
    res.status(200).json({ message: 'Trainer deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// ✅ GET all trainers (Public)
router.get('/', async (req, res) => {
  try {
    const trainers = await Trainer.find().populate('courseIds', 'name');
    const trainersWithBase64 = trainers.map(t => ({
      _id: t._id,
      name: t.name,
      education: t.education,
      skills: t.skills,
      courseIds: t.courseIds.map(c => c._id),
      courseNames: t.courseIds.map(c => c.name),
      photo: t.photo?.data
        ? `data:${t.photo.contentType};base64,${t.photo.data.toString('base64')}`
        : null
    }));
    res.status(200).json(trainersWithBase64);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// ✅ GET single trainer by ID (Public)
router.get('/:id', async (req, res) => {
  try {
    const t = await Trainer.findById(req.params.id).populate('courseIds', 'name');
    if (!t) return res.status(404).json({ message: 'Trainer not found' });

    res.status(200).json({
      _id: t._id,
      name: t.name,
      education: t.education,
      skills: t.skills,
      courseIds: t.courseIds.map(c => c._id),
      courseNames: t.courseIds.map(c => c.name),
      photoBase64: t.photo?.data
        ? `data:${t.photo.contentType};base64,${t.photo.data.toString('base64')}`
        : null
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

module.exports = router;
