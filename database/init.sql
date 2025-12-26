-- Database: my-portfolio (Compatible with MySQL 5.7 and above)
-- Run this script to create all required tables
-- Using utf8mb4_general_ci collation for compatibility

CREATE DATABASE IF NOT EXISTS `my-portfolio` CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `my-portfolio`;

-- Users table (for authentication)
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    slug VARCHAR(100) UNIQUE NOT NULL,
    icon VARCHAR(50),
    icon_color VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Skills table
CREATE TABLE IF NOT EXISTS skills (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(50),
    category_id INT,
    proficiency INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    slug VARCHAR(100) UNIQUE NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    long_description TEXT,
    image VARCHAR(500),
    category VARCHAR(50),
    role VARCHAR(100),
    role_details VARCHAR(200),
    timeline VARCHAR(50),
    timeline_date VARCHAR(50),
    live_url VARCHAR(500),
    github_url VARCHAR(500),
    status ENUM('draft', 'published', 'archived') DEFAULT 'published',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Project tags (many-to-many)
CREATE TABLE IF NOT EXISTS project_tags (
    id INT AUTO_INCREMENT PRIMARY KEY,
    project_id INT NOT NULL,
    tag_name VARCHAR(50) NOT NULL,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Certificates table
CREATE TABLE IF NOT EXISTS certificates (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    level VARCHAR(100),
    issuer VARCHAR(100) NOT NULL,
    issue_date VARCHAR(50),
    expiry_date VARCHAR(50),
    credential_url VARCHAR(500),
    logo_type VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Work History table
CREATE TABLE IF NOT EXISTS work_history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    company VARCHAR(200) NOT NULL,
    role VARCHAR(200) NOT NULL,
    location VARCHAR(100),
    start_date VARCHAR(50),
    end_date VARCHAR(50),
    is_current BOOLEAN DEFAULT FALSE,
    description TEXT,
    achievements JSON,
    technologies JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Profile table (single row)
CREATE TABLE IF NOT EXISTS profile (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    title VARCHAR(100),
    bio TEXT,
    short_bio TEXT,
    avatar VARCHAR(500),
    resume_url VARCHAR(500),
    email VARCHAR(255),
    phone VARCHAR(50),
    location VARCHAR(100),
    website VARCHAR(255),
    github_url VARCHAR(255),
    linkedin_url VARCHAR(255),
    twitter_url VARCHAR(255),
    instagram_url VARCHAR(255),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Contact messages table
CREATE TABLE IF NOT EXISTS contacts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    subject VARCHAR(200),
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Insert default admin user (password: admin123)
INSERT INTO users (email, password, name) VALUES
('admin@example.com', '$2a$10$rOvHPxfzO2.YR.EQqK.4UeQjO0lTHJxJxh6hT7KvB8YpZBvDKxKMa', 'Deni Suryadi');

-- Insert default profile
INSERT INTO profile (full_name, title, bio, email) VALUES
('Deni Suryadi', 'Fullstack Developer', 'Passionate developer with expertise in web development', 'admin@example.com');

-- Insert default categories
INSERT INTO categories (name, description, slug, icon, icon_color) VALUES
('Frontend', 'UI/UX, Web, Mobile', 'frontend', 'devices', 'bg-blue-500/10 text-blue-500'),
('Backend', 'Server, Database, API', 'backend', 'dns', 'bg-green-500/10 text-green-500'),
('DevOps', 'CI/CD, Infrastructure', 'devops', 'cloud', 'bg-orange-500/10 text-orange-500'),
('Design', 'UI Design, Prototyping', 'design', 'palette', 'bg-purple-500/10 text-purple-500');
