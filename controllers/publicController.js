const db = require('../config/database');

// Get public data for landing page
exports.getLandingData = async (req, res) => {
    try {
        // Get profile
        const [profiles] = await db.execute('SELECT * FROM profile LIMIT 1');
        const profile = profiles[0] || null;

        // Get published projects (limit 6 for landing page)
        const [projects] = await db.execute(`
            SELECT p.*, GROUP_CONCAT(pt.tag_name) as tags
            FROM projects p
            LEFT JOIN project_tags pt ON p.id = pt.project_id
            WHERE p.status = 'published'
            GROUP BY p.id
            ORDER BY p.created_at DESC
            LIMIT 6
        `);

        // Parse tags
        const formattedProjects = projects.map(p => ({
            ...p,
            tags: p.tags ? p.tags.split(',') : []
        }));

        // Get skills grouped by category
        const [skills] = await db.execute(`
            SELECT s.*, c.name as category_name, c.icon as category_icon, c.icon_color
            FROM skills s
            LEFT JOIN categories c ON s.category_id = c.id
            ORDER BY s.proficiency DESC
        `);

        // Get categories with skills
        const [categories] = await db.execute('SELECT * FROM categories ORDER BY name');

        // Group skills by category
        const skillsByCategory = categories.map(cat => ({
            id: cat.id,
            title: cat.name,
            icon: cat.icon || 'code',
            iconColor: cat.icon_color || 'bg-blue-500/10 text-blue-400',
            skills: skills.filter(s => s.category_id === cat.id).map(s => s.name)
        })).filter(cat => cat.skills.length > 0);

        // Get work history
        const [workHistory] = await db.execute(`
            SELECT * FROM work_history
            ORDER BY is_current DESC, start_date DESC
        `);

        // Get certificates
        const [certificates] = await db.execute(`
            SELECT * FROM certificates
            ORDER BY issue_date DESC
            LIMIT 6
        `);

        res.json({
            success: true,
            data: {
                profile,
                projects: formattedProjects,
                skills: skillsByCategory,
                workHistory,
                certificates
            }
        });
    } catch (error) {
        console.error('Get landing data error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get landing data'
        });
    }
};

// Submit contact form (public)
exports.submitContact = async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        if (!name || !email || !message) {
            return res.status(400).json({
                success: false,
                message: 'Name, email, and message are required'
            });
        }

        await db.execute(
            'INSERT INTO contacts (name, email, subject, message) VALUES (?, ?, ?, ?)',
            [name, email, subject || '', message]
        );

        res.json({
            success: true,
            message: 'Message sent successfully'
        });
    } catch (error) {
        console.error('Submit contact error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to send message'
        });
    }
};

// Get single project by slug (public)
exports.getProjectBySlug = async (req, res) => {
    try {
        const { slug } = req.params;

        const [projects] = await db.execute(`
            SELECT p.*, GROUP_CONCAT(pt.tag_name) as tags
            FROM projects p
            LEFT JOIN project_tags pt ON p.id = pt.project_id
            WHERE p.slug = ? AND p.status = 'published'
            GROUP BY p.id
        `, [slug]);

        if (projects.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Project not found'
            });
        }

        const project = {
            ...projects[0],
            tags: projects[0].tags ? projects[0].tags.split(',') : []
        };

        // Get prev/next projects
        const [allProjects] = await db.execute(`
            SELECT slug, title FROM projects
            WHERE status = 'published'
            ORDER BY created_at DESC
        `);

        const currentIndex = allProjects.findIndex(p => p.slug === slug);
        const prevProject = currentIndex > 0 ? allProjects[currentIndex - 1] : null;
        const nextProject = currentIndex < allProjects.length - 1 ? allProjects[currentIndex + 1] : null;

        res.json({
            success: true,
            data: {
                ...project,
                prevProject,
                nextProject
            }
        });
    } catch (error) {
        console.error('Get project by slug error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get project'
        });
    }
};
