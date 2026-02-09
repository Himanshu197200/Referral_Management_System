const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload');
const { protect } = require('../middlewares/auth');
const { createCandidate, getAllCandidates, getCandidateById, updateCandidateStatus, deleteCandidate } = require('../controllers/candidateController');

router.post('/', protect, upload.single('resume'), createCandidate);
router.get('/', protect, getAllCandidates);
router.get('/:id', protect, getCandidateById);
router.put('/:id/status', protect, updateCandidateStatus);
router.delete('/:id', protect, deleteCandidate);

module.exports = router;
