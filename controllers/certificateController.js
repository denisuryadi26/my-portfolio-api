const db = require('../config/database');

// Get all certificates
exports.getAll = async (req, res) => {
    try {
        const [certificates] = await db.execute(
            'SELECT * FROM certificates ORDER BY issue_date DESC'
        );

        res.json({
            success: true,
            data: certificates
        });
    } catch (error) {
        console.error('Get certificates error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get certificates'
        });
    }
};

// Get single certificate
exports.getOne = async (req, res) => {
    try {
        const { id } = req.params;
        const [certificates] = await db.execute(
            'SELECT * FROM certificates WHERE id = ?',
            [id]
        );

        if (certificates.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Certificate not found'
            });
        }

        res.json({
            success: true,
            data: certificates[0]
        });
    } catch (error) {
        console.error('Get certificate error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get certificate'
        });
    }
};

// Create certificate
exports.create = async (req, res) => {
    try {
        const { name, level, issuer, issue_date, expiry_date, credential_url, logo_type } = req.body;

        const [result] = await db.execute(
            `INSERT INTO certificates (name, level, issuer, issue_date, expiry_date, credential_url, logo_type)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [name, level, issuer, issue_date, expiry_date, credential_url, logo_type]
        );

        res.status(201).json({
            success: true,
            message: 'Certificate created successfully',
            data: { id: result.insertId }
        });
    } catch (error) {
        console.error('Create certificate error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create certificate'
        });
    }
};

// Update certificate
exports.update = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, level, issuer, issue_date, expiry_date, credential_url, logo_type } = req.body;

        await db.execute(
            `UPDATE certificates SET name = ?, level = ?, issuer = ?, issue_date = ?,
             expiry_date = ?, credential_url = ?, logo_type = ? WHERE id = ?`,
            [name, level, issuer, issue_date, expiry_date, credential_url, logo_type, id]
        );

        res.json({
            success: true,
            message: 'Certificate updated successfully'
        });
    } catch (error) {
        console.error('Update certificate error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update certificate'
        });
    }
};

// Delete certificate
exports.delete = async (req, res) => {
    try {
        const { id } = req.params;
        await db.execute('DELETE FROM certificates WHERE id = ?', [id]);

        res.json({
            success: true,
            message: 'Certificate deleted successfully'
        });
    } catch (error) {
        console.error('Delete certificate error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete certificate'
        });
    }
};
