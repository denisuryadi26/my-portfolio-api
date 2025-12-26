const db = require('../config/database');

// Get all work history
exports.getAll = async (req, res) => {
    try {
        const [jobs] = await db.execute(
            'SELECT * FROM work_history ORDER BY is_current DESC, start_date DESC'
        );

        // Map role to position for frontend compatibility
        const mappedJobs = jobs.map(job => {
            let achievements = [];
            let technologies = [];

            // Safely parse JSON fields
            try {
                if (job.achievements) {
                    achievements = typeof job.achievements === 'string'
                        ? JSON.parse(job.achievements)
                        : job.achievements;
                }
            } catch (e) {
                achievements = [];
            }

            try {
                if (job.technologies) {
                    technologies = typeof job.technologies === 'string'
                        ? JSON.parse(job.technologies)
                        : job.technologies;
                }
            } catch (e) {
                technologies = [];
            }

            return {
                ...job,
                position: job.role, // Alias for frontend
                achievements,
                technologies
            };
        });

        res.json({
            success: true,
            data: mappedJobs
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

        let achievements = [];
        let technologies = [];

        try {
            if (jobs[0].achievements) {
                achievements = typeof jobs[0].achievements === 'string'
                    ? JSON.parse(jobs[0].achievements)
                    : jobs[0].achievements;
            }
        } catch (e) {
            achievements = [];
        }

        try {
            if (jobs[0].technologies) {
                technologies = typeof jobs[0].technologies === 'string'
                    ? JSON.parse(jobs[0].technologies)
                    : jobs[0].technologies;
            }
        } catch (e) {
            technologies = [];
        }

        const job = {
            ...jobs[0],
            position: jobs[0].role,
            achievements,
            technologies
        };

        res.json({
            success: true,
            data: job
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
        const {
            company,
            role,
            position, // Accept both role and position
            location,
            start_date,
            end_date,
            is_current,
            description,
            achievements,
            technologies
        } = req.body;

        // Use position if role is not provided (frontend sends position)
        const jobRole = role || position || '';
        const jobAchievements = achievements && achievements.length > 0 ? JSON.stringify(achievements) : null;
        const jobTechnologies = technologies && technologies.length > 0 ? JSON.stringify(technologies) : null;

        const [result] = await db.execute(
            `INSERT INTO work_history (company, role, location, start_date, end_date, is_current, description, achievements, technologies)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [company, jobRole, location, start_date, end_date, is_current || false, description, jobAchievements, jobTechnologies]
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
        const {
            company,
            role,
            position,
            location,
            start_date,
            end_date,
            is_current,
            description,
            achievements,
            technologies
        } = req.body;

        const jobRole = role || position || '';
        const jobAchievements = achievements && achievements.length > 0 ? JSON.stringify(achievements) : null;
        const jobTechnologies = technologies && technologies.length > 0 ? JSON.stringify(technologies) : null;

        await db.execute(
            `UPDATE work_history SET company = ?, role = ?, location = ?, start_date = ?,
             end_date = ?, is_current = ?, description = ?, achievements = ?, technologies = ? WHERE id = ?`,
            [company, jobRole, location, start_date, end_date, is_current, description, jobAchievements, jobTechnologies, id]
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
