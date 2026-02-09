const Candidate = require('../models/Candidate');
const fs = require('fs');
const path = require('path');

const createCandidate = async (req, res) => {
    try {
        const { name, email, phone, jobTitle } = req.body;

        const existingCandidate = await Candidate.findOne({ email, userId: req.user._id });
        if (existingCandidate) {
            if (req.file) {
                fs.unlinkSync(req.file.path);
            }
            return res.status(400).json({
                success: false,
                message: 'A candidate with this email already exists'
            });
        }

        const candidateData = {
            name,
            email,
            phone,
            jobTitle,
            status: 'Pending',
            userId: req.user._id
        };

        if (req.file) {
            candidateData.resumeUrl = `/uploads/${req.file.filename}`;
        }

        const candidate = await Candidate.create(candidateData);

        res.status(201).json({
            success: true,
            message: 'Candidate referred successfully',
            data: candidate
        });
    } catch (error) {
        if (req.file) {
            fs.unlinkSync(req.file.path);
        }

        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: messages.join(', ')
            });
        }

        res.status(500).json({
            success: false,
            message: 'Server error while creating candidate'
        });
    }
};

const getAllCandidates = async (req, res) => {
    try {
        const { status, jobTitle, search } = req.query;
        let filter = { userId: req.user._id };

        if (status && status !== 'All') {
            filter.status = status;
        }

        if (jobTitle) {
            filter.jobTitle = { $regex: jobTitle, $options: 'i' };
        }

        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: 'i' } },
                { jobTitle: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ];
        }

        const candidates = await Candidate.find(filter).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: candidates.length,
            data: candidates
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error while fetching candidates'
        });
    }
};

const getCandidateById = async (req, res) => {
    try {
        const candidate = await Candidate.findById(req.params.id);

        if (!candidate) {
            return res.status(404).json({
                success: false,
                message: 'Candidate not found'
            });
        }

        res.status(200).json({
            success: true,
            data: candidate
        });
    } catch (error) {
        if (error.kind === 'ObjectId') {
            return res.status(400).json({
                success: false,
                message: 'Invalid candidate ID format'
            });
        }
        res.status(500).json({
            success: false,
            message: 'Server error while fetching candidate'
        });
    }
};

const updateCandidateStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const validStatuses = ['Pending', 'Reviewed', 'Hired'];

        if (!status || !validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status. Must be: Pending, Reviewed, or Hired'
            });
        }

        const candidate = await Candidate.findOneAndUpdate(
            { _id: req.params.id, userId: req.user._id },
            { status },
            { new: true, runValidators: true }
        );

        if (!candidate) {
            return res.status(404).json({
                success: false,
                message: 'Candidate not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Candidate status updated successfully',
            data: candidate
        });
    } catch (error) {
        if (error.kind === 'ObjectId') {
            return res.status(400).json({
                success: false,
                message: 'Invalid candidate ID format'
            });
        }
        res.status(500).json({
            success: false,
            message: 'Server error while updating candidate status'
        });
    }
};

const deleteCandidate = async (req, res) => {
    try {
        const candidate = await Candidate.findOne({ _id: req.params.id, userId: req.user._id });

        if (!candidate) {
            return res.status(404).json({
                success: false,
                message: 'Candidate not found'
            });
        }

        if (candidate.resumeUrl) {
            const filePath = path.join(__dirname, '..', candidate.resumeUrl);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }

        await Candidate.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: 'Candidate deleted successfully'
        });
    } catch (error) {
        if (error.kind === 'ObjectId') {
            return res.status(400).json({
                success: false,
                message: 'Invalid candidate ID format'
            });
        }
        res.status(500).json({
            success: false,
            message: 'Server error while deleting candidate'
        });
    }
};

module.exports = {
    createCandidate,
    getAllCandidates,
    getCandidateById,
    updateCandidateStatus,
    deleteCandidate
};
