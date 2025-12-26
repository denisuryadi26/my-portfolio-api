-- Migration: Update profile table to support all frontend fields
-- Run this in your MySQL database

-- Add new columns to profile table
ALTER TABLE profile
    ADD COLUMN IF NOT EXISTS full_name VARCHAR(100) AFTER id,
    ADD COLUMN IF NOT EXISTS short_bio TEXT AFTER bio,
    ADD COLUMN IF NOT EXISTS website VARCHAR(255) AFTER location,
    ADD COLUMN IF NOT EXISTS github_url VARCHAR(255) AFTER website,
    ADD COLUMN IF NOT EXISTS linkedin_url VARCHAR(255) AFTER github_url,
    ADD COLUMN IF NOT EXISTS twitter_url VARCHAR(255) AFTER linkedin_url,
    ADD COLUMN IF NOT EXISTS instagram_url VARCHAR(255) AFTER twitter_url;

-- Rename columns if they exist with old names
-- Note: You may need to manually transfer data from old columns to new ones

-- Copy data from old columns to new ones (if they exist)
UPDATE profile SET
    full_name = COALESCE(full_name, name),
    avatar = COALESCE(avatar, avatar_url),
    github_url = COALESCE(github_url, github),
    linkedin_url = COALESCE(linkedin_url, linkedin),
    twitter_url = COALESCE(twitter_url, twitter)
WHERE id > 0;

-- Alternative: Drop and recreate the profile table with new schema
-- WARNING: This will delete existing data!
--
-- DROP TABLE IF EXISTS profile;
--
-- CREATE TABLE profile (
--     id INT AUTO_INCREMENT PRIMARY KEY,
--     full_name VARCHAR(100) NOT NULL,
--     title VARCHAR(100),
--     bio TEXT,
--     short_bio TEXT,
--     avatar VARCHAR(500),
--     resume_url VARCHAR(500),
--     email VARCHAR(255),
--     phone VARCHAR(50),
--     location VARCHAR(100),
--     website VARCHAR(255),
--     github_url VARCHAR(255),
--     linkedin_url VARCHAR(255),
--     twitter_url VARCHAR(255),
--     instagram_url VARCHAR(255),
--     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
-- );
--
-- INSERT INTO profile (full_name, title, bio, email) VALUES
-- ('Deni Suryadi', 'Fullstack Developer', 'Passionate developer with expertise in web development', 'admin@example.com');
