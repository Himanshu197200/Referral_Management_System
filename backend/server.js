const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const connectDB = require('./config/db');
const candidateRoutes = require('./routes/candidateRoutes');

const app = express();

connectDB();

const getAllowedOrigins = () => {
    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
    return clientUrl.split(',').map(url => url.trim());
};

app.use(cors({
    origin: function (origin, callback) {
        const allowedOrigins = getAllowedOrigins();
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin) || allowedOrigins.includes('*') || origin.includes('vercel.app')) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/', (req, res) => {
    res.status(200).json({ success: true, message: 'Candidate Referral Management API', version: '1.0.0' });
});

app.use('/api/candidates', candidateRoutes);

app.get('/api/health', (req, res) => {
    res.status(200).json({ success: true, message: 'Server is running' });
});

app.use((req, res) => {
    res.status(404).json({ success: false, message: 'Route not found' });
});

app.use((err, req, res, next) => {
    console.error(err.stack);

    if (err.message === 'Not allowed by CORS') {
        return res.status(403).json({ success: false, message: 'CORS policy: Origin not allowed' });
    }
    if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ success: false, message: 'File size too large. Maximum size is 5MB' });
    }
    if (err.message === 'Only PDF files are allowed') {
        return res.status(400).json({ success: false, message: err.message });
    }
    res.status(500).json({ success: false, message: 'Internal server error' });
});

const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

if (process.env.VERCEL !== '1') {
    const PORT = process.env.PORT || 5001;
    app.listen(PORT, () => {
        console.log('Server running on port ' + PORT);
    });
}

module.exports = app;
