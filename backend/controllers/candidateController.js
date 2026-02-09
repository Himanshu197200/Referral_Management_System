const Candidate = require('../models/Candidate');
const cloudinary = require('../config/cloudinary');

const uploadToCloudinary = (buffer, filename) => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                resource_type: 'raw',
                folder: 'referral-resumes',
                public_id: filename,
                type: 'authenticated'
            },
            (error, result) => {
                if (error) reject(error);
                else resolve(result);
            }
        );
        uploadStream.end(buffer);
    });
};

const generateSignedUrl = (publicId) => {
    return cloudinary.url(publicId, {
        resource_type: 'raw',
        type: 'authenticated',
        sign_url: true,
        expires_at: Math.floor(Date.now() / 1000) + 3600
    });
};




const deleteFromCloudinary = async (url) => {
    try {
        const parts = url.split('/');
        const filenameWithExt = parts[parts.length - 1];
        const filename = filenameWithExt.replace('.pdf', '');
        const publicId = 'referral-resumes/' + filename;

        try {
            await cloudinary.uploader.destroy(publicId, { resource_type: 'raw', type: 'authenticated' });
        } catch {
            try {
                await cloudinary.uploader.destroy(publicId, { resource_type: 'raw' });
            } catch {
                await cloudinary.uploader.destroy(publicId, { resource_type: 'image' });
            }
        }
    } catch (error) {
        console.error('Error deleting from Cloudinary:', error);
    }
};



const createCandidate = async (req, res) => {
    try {
        const { name, email, phone, jobTitle } = req.body;

        const existingCandidate = await Candidate.findOne({ email, userId: req.user._id });
        if (existingCandidate) {
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
            const filename = Date.now() + '-' + req.file.originalname.replace(/\s+/g, '_');
            const result = await uploadToCloudinary(req.file.buffer, filename);
            candidateData.resumeUrl = result.secure_url;
        }

        const candidate = await Candidate.create(candidateData);

        res.status(201).json({
            success: true,
            message: 'Candidate referred successfully',
            data: candidate
        });
    } catch (error) {
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: messages.join(', ')
            });
        }

        console.error('Create candidate error:', error);
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

        if (candidate.resumeUrl && candidate.resumeUrl.includes('cloudinary')) {
            await deleteFromCloudinary(candidate.resumeUrl);
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

const getResumeUrl = async (req, res) => {
    try {
        const candidate = await Candidate.findOne({
            _id: req.params.id,
            userId: req.user._id
        });

        if (!candidate) {
            return res.status(404).json({
                success: false,
                message: 'Candidate not found'
            });
        }

        if (!candidate.resumeUrl) {
            return res.status(404).json({
                success: false,
                message: 'No resume found for this candidate'
            });
        }

        const url = candidate.resumeUrl;

        if (url.includes('cloudinary') && url.includes('/authenticated/')) {
            const publicIdMatch = url.match(/referral-resumes\/[^.]+/);
            if (publicIdMatch) {
                const signedUrl = generateSignedUrl(publicIdMatch[0]);
                return res.status(200).json({
                    success: true,
                    data: { resumeUrl: signedUrl }
                });
            }
        }

        res.status(200).json({
            success: true,
            data: { resumeUrl: url }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error while getting resume URL'
        });
    }
};

module.exports = {
    createCandidate,
    getAllCandidates,
    getCandidateById,
    updateCandidateStatus,
    deleteCandidate,
    getResumeUrl
};
