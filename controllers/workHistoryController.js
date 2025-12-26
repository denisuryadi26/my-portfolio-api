const db = require('../config/database');

// Get all work history
exports.getAll = async (req, res) => {
    try {
        const [jobs] = await db.execute(
            'SELECT * FROM work_history ORDER BY is_current DESC, start_date DESC'
        );

        res.json({
            success: true,
            data: jobs
        });
    } catch (error) {
        console.error('Get work history error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get work history'
        });
    }
};

// Get single job
exports.getOne = async (req, res) => {
    try {
        const { id } = req.params;
        const [jobs] = await db.execute(
            'SELECT * FROM work_history WHERE id = ?',
            [id]
        );

        if (jobs.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Job not found'
            });
        }

        res.json({
            success: true,
            data: jobs[0]
        });
    } catch (error) {
        console.error('Get job error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get job'
        });
    }
};

// Create job
exports.create = async (req, res) => {
    try {
        const { company, role, location, start_date, end_date, is_current, description } = req.body;

        const [result] = await db.execute(
            `INSERT INTO work_history (company, role, location, start_date, end_date, is_current, description)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [company, role, location, start_date, end_date, is_current || false, description]
        );

        res.status(201).json({
            success: true,
            message: 'Job created successfully',
            data: { id: result.insertId }
        });
    } catch (error) {
        console.error('Create job error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create job'
        });
    }
};

// Update job
exports.update = async (req, res) => {
    try {
        const { id } = req.params;
        const { company, role, location, start_date, end_date, is_current, description } = req.body;

        await db.execute(
            `UPDATE work_history SET company = ?, role = ?, location = ?, start_date = ?,
             end_date = ?, is_current = ?, description = ? WHERE id = ?`,
            [company, role, location, start_date, end_date, is_current, description, id]
        );

        res.json({
            success: true,
            message: 'Job updated successfully'
        });
    } catch (error) {
        console.error('Update job error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update job'
        });
    }
};

// Delete job
exports.delete = async (req, res) => {
    try {
        const { id } = req.params;
        await db.execute('DELETE FROM work_history WHERE id = ?', [id]);

        res.json({
            success: true,
            message: 'Job deleted successfully'
        });
    } catch (error) {
        console.error('Delete job error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete job'
        });
    }
};
