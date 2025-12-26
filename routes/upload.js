const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { authMiddleware } = require('../middleware/auth');

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
    }
});

// File filter - only allow images
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed (jpeg, jpg, png, gif, webp)'), false);
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    }
});

// POST /api/upload - Upload single image
router.post('/', authMiddleware, upload.single('image'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No file uploaded'
            });
        }

        const baseUrl = `${req.protocol}://${req.get('host')}`;
        const fileUrl = `${baseUrl}/uploads/${req.file.filename}`;

        res.json({
            success: true,
            message: 'File uploaded successfully',
            data: {
                filename: req.file.filename,
                originalname: req.file.originalname,
                size: req.file.size,
                url: fileUrl
            }
        });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to upload file'
        });
    }
});

// Error handling for multer
router.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                success: false,
                message: 'File size too large. Maximum allowed size exceeded.'
            });
        }
        return res.status(400).json({
            success: false,
            message: err.message
        });
    }
    if (err) {
        return res.status(400).json({
            success: false,
            message: err.message
        });
    }
    next();
});

// Document filter - allow PDF, DOC, DOCX
const documentFilter = (req, file, cb) => {
    const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Only PDF and Word documents are allowed'), false);
    }
};

const documentUpload = multer({
    storage,
    fileFilter: documentFilter,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit for documents
    }
});

// POST /api/upload/document - Upload document (resume/CV)
router.post('/document', authMiddleware, documentUpload.single('document'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No file uploaded'
            });
        }

        const baseUrl = `${req.protocol}://${req.get('host')}`;
        const fileUrl = `${baseUrl}/uploads/${req.file.filename}`;

        res.json({
            success: true,
            message: 'Document uploaded successfully',
            data: {
                filename: req.file.filename,
                originalname: req.file.originalname,
                size: req.file.size,
                url: fileUrl
            }
        });
    } catch (error) {
        console.error('Document upload error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to upload document'
        });
    }
});

module.exports = router;
