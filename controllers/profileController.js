const db = require('../config/database');

// Get profile
exports.get = async (req, res) => {
    try {
        const [profiles] = await db.execute('SELECT * FROM profile LIMIT 1');

        if (profiles.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Profile not found'
            });
        }

        res.json({
            success: true,
            data: profiles[0]
        });
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get profile'
        });
    }
};

// Update profile
exports.update = async (req, res) => {
    try {
        const {
            full_name, title, bio, short_bio, avatar, resume_url,
            email, phone, location, website,
            github_url, linkedin_url, twitter_url, instagram_url
        } = req.body;

        // Check if profile exists
        const [profiles] = await db.execute('SELECT id FROM profile LIMIT 1');

        if (profiles.length === 0) {
            // Create new profile
            await db.execute(
                `INSERT INTO profile (full_name, title, bio, short_bio, avatar, resume_url,
                 email, phone, location, website, github_url, linkedin_url, twitter_url, instagram_url)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [full_name, title, bio, short_bio, avatar, resume_url,
                 email, phone, location, website, github_url, linkedin_url, twitter_url, instagram_url]
            );
        } else {
            // Update existing profile
            await db.execute(
                `UPDATE profile SET
                 full_name = ?, title = ?, bio = ?, short_bio = ?, avatar = ?, resume_url = ?,
                 email = ?, phone = ?, location = ?, website = ?,
                 github_url = ?, linkedin_url = ?, twitter_url = ?, instagram_url = ?
                 WHERE id = ?`,
                [full_name, title, bio, short_bio, avatar, resume_url,
                 email, phone, location, website, github_url, linkedin_url, twitter_url, instagram_url,
                 profiles[0].id]
            );
        }

        res.json({
            success: true,
            message: 'Profile updated successfully'
        });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update profile'
        });
    }
};
