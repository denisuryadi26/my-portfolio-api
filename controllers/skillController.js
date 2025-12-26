const db = require('../config/database');

// Get all skills
exports.getAll = async (req, res) => {
    try {
        const [skills] = await db.execute(`
            SELECT s.*, c.name as category_name
            FROM skills s
            LEFT JOIN categories c ON s.category_id = c.id
            ORDER BY s.name
        `);

        res.json({
            success: true,
            data: skills
        });
    } catch (error) {
        console.error('Get skills error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get skills'
        });
    }
};

// Get single skill
exports.getOne = async (req, res) => {
    try {
        const { id } = req.params;
        const [skills] = await db.execute(
            'SELECT * FROM skills WHERE id = ?',
            [id]
        );

        if (skills.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Skill not found'
            });
        }

        res.json({
            success: true,
            data: skills[0]
        });
    } catch (error) {
        console.error('Get skill error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get skill'
        });
    }
};

// Create skill
exports.create = async (req, res) => {
    try {
        const { name, type, category_id, proficiency } = req.body;

        const [result] = await db.execute(
            'INSERT INTO skills (name, type, category_id, proficiency) VALUES (?, ?, ?, ?)',
            [name, type, category_id, proficiency || 0]
        );

        res.status(201).json({
            success: true,
            message: 'Skill created successfully',
            data: { id: result.insertId }
        });
    } catch (error) {
        console.error('Create skill error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create skill'
        });
    }
};

// Update skill
exports.update = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, type, category_id, proficiency } = req.body;

        await db.execute(
            'UPDATE skills SET name = ?, type = ?, category_id = ?, proficiency = ? WHERE id = ?',
            [name, type, category_id, proficiency, id]
        );

        res.json({
            success: true,
            message: 'Skill updated successfully'
        });
    } catch (error) {
        console.error('Update skill error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update skill'
        });
    }
};

// Delete skill
exports.delete = async (req, res) => {
    try {
        const { id } = req.params;
        await db.execute('DELETE FROM skills WHERE id = ?', [id]);

        res.json({
            success: true,
            message: 'Skill deleted successfully'
        });
    } catch (error) {
        console.error('Delete skill error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete skill'
        });
    }
};
