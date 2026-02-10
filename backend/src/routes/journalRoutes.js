const express = require('express');
const router = express.Router();
const { getAllEntries, getEntryById, saveReflection, getMyReflections, getAllReflections, generateReflectionPDF } = require('../controllers/journalController');
const { auth, admin } = require('../middleware/authMiddleware');

router.get('/', getAllEntries);
router.get('/my-reflections', auth, getMyReflections);
// Admin Routes
router.get('/admin/all', auth, admin, getAllReflections);
router.get('/admin/export/:id', auth, admin, generateReflectionPDF);

// Put generic ID route last to avoid conflict
router.get('/:id', getEntryById);
router.post('/reflect', auth, saveReflection);

module.exports = router;
