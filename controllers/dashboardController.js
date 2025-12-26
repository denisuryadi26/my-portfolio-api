const db = require('../config/database');

// Get dashboard stats
exports.getStats = async (req, res) => {
    try {
        // Get counts
        const [projectCount] = await db.execute('SELECT COUNT(*) as count FROM projects');
        const [skillCount] = await db.execute('SELECT COUNT(*) as count FROM skills');
        const [contactCount] = await db.execute('SELECT COUNT(*) as count FROM contacts WHERE is_read = FALSE');
        const [certCount] = await db.execute('SELECT COUNT(*) as count FROM certificates');

        // Get recent projects
        const [recentProjects] = await db.execute(
            'SELECT id, title, slug, created_at FROM projects ORDER BY created_at DESC LIMIT 5'
        );

        // Get recent messages
        const [recentMessages] = await db.execute(
            'SELECT id, name, subject, is_read, created_at FROM contacts ORDER BY created_at DESC LIMIT 5'
        );

        res.json({
            success: true,
            data: {
                stats: {
                    projects: projectCount[0].count,
                    skills: skillCount[0].count,
                    unreadMessages: contactCount[0].count,
                    certificates: certCount[0].count
                },
                recentProjects,
                recentMessages
            }
        });
    } catch (error) {
        console.error('Get stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get dashboard stats'
        });
    }
};
