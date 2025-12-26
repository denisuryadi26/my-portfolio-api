const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');
require('dotenv').config();

async function seedAdmin() {
    const pool = mysql.createPool({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'my-portfolio',
    });

    try {
        // Hash password
        const password = 'admin123';
        const hashedPassword = await bcrypt.hash(password, 10);

        console.log('Generated hash:', hashedPassword);

        // Delete existing user
        await pool.execute('DELETE FROM users WHERE email = ?', ['admin@gmail.com']);

        // Insert new user with correct hash
        await pool.execute(
            'INSERT INTO users (email, password, name) VALUES (?, ?, ?)',
            ['admin@gmail.com', hashedPassword, 'Deni Suryadi']
        );

        console.log('✓ Admin user created successfully!');
        console.log('  Email: admin@gmail.com');
        console.log('  Password: admin123');

        // Verify the hash works
        const isValid = await bcrypt.compare(password, hashedPassword);
        console.log('  Password verification:', isValid ? '✓ OK' : '✗ FAILED');

    } catch (error) {
        console.error('Error:', error.message);
    } finally {
        await pool.end();
    }
}

seedAdmin();
