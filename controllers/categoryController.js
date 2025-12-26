const db = require('../config/database');

// Get all categories
exports.getAll = async (req, res) => {
    try {
        const [categories] = await db.execute('SELECT * FROM categories ORDER BY name');

        // Get skill count for each category
        for (let category of categories) {
            const [count] = await db.execute(
                'SELECT COUNT(*) as skill_count FROM skills WHERE category_id = ?',
                [category.id]
            );
            category.skill_count = count[0].skill_count;
        }

        res.json({
            success: true,
            data: categories
        });
    } catch (error) {
        console.error('Get categories error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get categories'
        });
    }
};

// Get single category
exports.getOne = async (req, res) => {
    try {
        const { id } = req.params;
        const [categories] = await db.execute(
            'SELECT * FROM categories WHERE id = ?',
            [id]
        );

        if (categories.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Category not found'
            });
        }

        res.json({
            success: true,
            data: categories[0]
        });
    } catch (error) {
        console.error('Get category error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get category'
        });
    }
};

// Create category
exports.create = async (req, res) => {
    try {
        const { name, description, slug, icon, icon_color } = req.body;

        const [result] = await db.execute(
            'INSERT INTO categories (name, description, slug, icon, icon_color) VALUES (?, ?, ?, ?, ?)',
            [name, description, slug, icon, icon_color]
        );

        res.status(201).json({
            success: true,
            message: 'Category created successfully',
            data: { id: result.insertId }
        });
    } catch (error) {
        console.error('Create category error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create category'
        });
    }
};

// Update category
exports.update = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, slug, icon, icon_color } = req.body;

        await db.execute(
            'UPDATE categories SET name = ?, description = ?, slug = ?, icon = ?, icon_color = ? WHERE id = ?',
            [name, description, slug, icon, icon_color, id]
        );

        res.json({
            success: true,
            message: 'Category updated successfully'
        });
    } catch (error) {
        console.error('Update category error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update category'
        });
    }
};

// Delete category
exports.delete = async (req, res) => {
    try {
        const { id } = req.params;
        await db.execute('DELETE FROM categories WHERE id = ?', [id]);

        res.json({
            success: true,
            message: 'Category deleted successfully'
        });
    } catch (error) {
        console.error('Delete category error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete category'
        });
    }
};
