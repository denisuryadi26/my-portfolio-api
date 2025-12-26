const db = require('../config/database');

// Get all projects
exports.getAll = async (req, res) => {
    try {
        const [projects] = await db.execute(
            'SELECT * FROM projects ORDER BY created_at DESC'
        );

        // Get tags for each project
        for (let project of projects) {
            const [tags] = await db.execute(
                'SELECT tag_name FROM project_tags WHERE project_id = ?',
                [project.id]
            );
            project.tags = tags.map(t => t.tag_name);
        }

        res.json({
            success: true,
            data: projects
        });
    } catch (error) {
        console.error('Get projects error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get projects'
        });
    }
};

// Get single project
exports.getOne = async (req, res) => {
    try {
        const { id } = req.params;
        const [projects] = await db.execute(
            'SELECT * FROM projects WHERE id = ? OR slug = ?',
            [id, id]
        );

        if (projects.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Project not found'
            });
        }

        const project = projects[0];

        // Get tags
        const [tags] = await db.execute(
            'SELECT tag_name FROM project_tags WHERE project_id = ?',
            [project.id]
        );
        project.tags = tags.map(t => t.tag_name);

        res.json({
            success: true,
            data: project
        });
    } catch (error) {
        console.error('Get project error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get project'
        });
    }
};

// Create project
exports.create = async (req, res) => {
    try {
        const {
            slug, title, description, long_description, image,
            category, role, role_details, timeline, timeline_date,
            live_url, github_url, status, tags
        } = req.body;

        const [result] = await db.execute(
            `INSERT INTO projects (slug, title, description, long_description, image,
             category, role, role_details, timeline, timeline_date, live_url, github_url, status)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [slug, title, description, long_description, image,
             category, role, role_details, timeline, timeline_date,
             live_url, github_url, status || 'published']
        );

        // Insert tags
        if (tags && tags.length > 0) {
            for (const tag of tags) {
                await db.execute(
                    'INSERT INTO project_tags (project_id, tag_name) VALUES (?, ?)',
                    [result.insertId, tag]
                );
            }
        }

        res.status(201).json({
            success: true,
            message: 'Project created successfully',
            data: { id: result.insertId }
        });
    } catch (error) {
        console.error('Create project error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create project'
        });
    }
};

// Update project
exports.update = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            slug, title, description, long_description, image,
            category, role, role_details, timeline, timeline_date,
            live_url, github_url, status, tags
        } = req.body;

        await db.execute(
            `UPDATE projects SET
             slug = ?, title = ?, description = ?, long_description = ?, image = ?,
             category = ?, role = ?, role_details = ?, timeline = ?, timeline_date = ?,
             live_url = ?, github_url = ?, status = ?
             WHERE id = ?`,
            [slug, title, description, long_description, image,
             category, role, role_details, timeline, timeline_date,
             live_url, github_url, status, id]
        );

        // Update tags
        if (tags) {
            await db.execute('DELETE FROM project_tags WHERE project_id = ?', [id]);
            for (const tag of tags) {
                await db.execute(
                    'INSERT INTO project_tags (project_id, tag_name) VALUES (?, ?)',
                    [id, tag]
                );
            }
        }

        res.json({
            success: true,
            message: 'Project updated successfully'
        });
    } catch (error) {
        console.error('Update project error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update project'
        });
    }
};

// Delete project
exports.delete = async (req, res) => {
    try {
        const { id } = req.params;
        await db.execute('DELETE FROM projects WHERE id = ?', [id]);

        res.json({
            success: true,
            message: 'Project deleted successfully'
        });
    } catch (error) {
        console.error('Delete project error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete project'
        });
    }
};
