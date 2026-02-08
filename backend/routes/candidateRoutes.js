const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload');
const { createCandidate, getAllCandidates, getCandidateById, updateCandidateStatus, deleteCandidate } = require('../controllers/candidateController');

router.post('/', upload.single('resume'), createCandidate);
router.get('/', getAllCandidates);
router.get('/:id', getCandidateById);
router.put('/:id/status', updateCandidateStatus);
router.delete('/:id', deleteCandidate);

module.exports = router;
