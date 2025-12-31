require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// CORS Configuration
const corsOptions = {
    origin: [
        'http://localhost:3000',
        'https://denisuryadi.netlify.app'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check (before routes to ensure it always works)
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        message: 'API is running',
        node_version: process.version,
        env: process.env.NODE_ENV || 'development'
    });
});

// Debug endpoint to check database connection
app.get('/api/debug', async (req, res) => {
    try {
        const db = require('./config/database');
        const [rows] = await db.execute('SELECT 1 as test');
        res.json({
            status: 'ok',
            database: 'connected',
            test: rows
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            database: 'failed',
            error: error.message
        });
    }
});

// Import and register routes with error handling
try {
    const authRoutes = require('./routes/auth');
    const projectRoutes = require('./routes/projects');
    const skillRoutes = require('./routes/skills');
    const categoryRoutes = require('./routes/categories');
    const certificateRoutes = require('./routes/certificates');
    const workHistoryRoutes = require('./routes/workHistory');
    const profileRoutes = require('./routes/profile');
    const contactRoutes = require('./routes/contacts');
    const dashboardRoutes = require('./routes/dashboard');
    const uploadRoutes = require('./routes/upload');
    const publicRoutes = require('./routes/public');

    // Public API Routes (no auth required)
    app.use('/api/public', publicRoutes);

    // Protected API Routes
    app.use('/api/auth', authRoutes);
    app.use('/api/projects', projectRoutes);
    app.use('/api/skills', skillRoutes);
    app.use('/api/categories', categoryRoutes);
    app.use('/api/certificates', certificateRoutes);
    app.use('/api/work-history', workHistoryRoutes);
    app.use('/api/profile', profileRoutes);
    app.use('/api/contacts', contactRoutes);
    app.use('/api/dashboard', dashboardRoutes);
    app.use('/api/upload', uploadRoutes);

    console.log('✅ All routes loaded successfully');
} catch (error) {
    console.error('❌ Error loading routes:', error.message);
}

// 404 handler
app.use((req, res) => {
    res.status(404).json({ success: false, message: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
    console.error('Error:', err.stack);
    res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📚 API docs: http://localhost:${PORT}/api/health`);
});
