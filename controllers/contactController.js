const db = require('../config/database');

// Get all contacts (messages)
exports.getAll = async (req, res) => {
    try {
        const [contacts] = await db.execute(
            'SELECT * FROM contacts ORDER BY created_at DESC'
        );

        res.json({
            success: true,
            data: contacts
        });
    } catch (error) {
        console.error('Get contacts error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get contacts'
        });
    }
};

// Get single contact
exports.getOne = async (req, res) => {
    try {
        const { id } = req.params;
        const [contacts] = await db.execute(
            'SELECT * FROM contacts WHERE id = ?',
            [id]
        );

        if (contacts.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Contact not found'
            });
        }

        // Mark as read
        await db.execute('UPDATE contacts SET is_read = TRUE WHERE id = ?', [id]);

        res.json({
            success: true,
            data: contacts[0]
        });
    } catch (error) {
        console.error('Get contact error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get contact'
        });
    }
};

// Create contact (public - for contact form)
exports.create = async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        if (!name || !email || !message) {
            return res.status(400).json({
                success: false,
                message: 'Name, email, and message are required'
            });
        }

        const [result] = await db.execute(
            'INSERT INTO contacts (name, email, subject, message) VALUES (?, ?, ?, ?)',
            [name, email, subject, message]
        );

        res.status(201).json({
            success: true,
            message: 'Message sent successfully',
            data: { id: result.insertId }
        });
    } catch (error) {
        console.error('Create contact error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to send message'
        });
    }
};

// Delete contact
exports.delete = async (req, res) => {
    try {
        const { id } = req.params;
        await db.execute('DELETE FROM contacts WHERE id = ?', [id]);

        res.json({
            success: true,
            message: 'Contact deleted successfully'
        });
    } catch (error) {
        console.error('Delete contact error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete contact'
        });
    }
};

// Mark as read/unread
exports.toggleRead = async (req, res) => {
    try {
        const { id } = req.params;
        const { is_read } = req.body;

        await db.execute('UPDATE contacts SET is_read = ? WHERE id = ?', [is_read, id]);

        res.json({
            success: true,
            message: 'Contact updated successfully'
        });
    } catch (error) {
        console.error('Toggle read error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update contact'
        });
    }
};
