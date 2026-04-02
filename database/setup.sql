-- ============================================================
--  CMS Portal — MySQL Setup Script
--  Run this ONCE before starting the application
-- ============================================================

-- 1. Create the database
CREATE DATABASE IF NOT EXISTS cms_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE cms_db;

-- 2. Create a dedicated user (change password as needed)
CREATE USER IF NOT EXISTS 'cms_user'@'localhost' IDENTIFIED BY 'Cms@1234';
GRANT ALL PRIVILEGES ON cms_db.* TO 'cms_user'@'localhost';
FLUSH PRIVILEGES;

-- ============================================================
--  Tables are auto-created by Spring Boot (ddl-auto=update)
--  The script below is for reference / manual creation only
-- ============================================================

CREATE TABLE IF NOT EXISTS users (
    id             BIGINT AUTO_INCREMENT PRIMARY KEY,
    name           VARCHAR(100)        NOT NULL,
    email          VARCHAR(150)        NOT NULL UNIQUE,
    password       VARCHAR(255)        NOT NULL,
    email_verified TINYINT(1)          NOT NULL DEFAULT 0,
    created_at     DATETIME            NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS otp_tokens (
    id         BIGINT AUTO_INCREMENT PRIMARY KEY,
    email      VARCHAR(150) NOT NULL,
    code       VARCHAR(10)  NOT NULL,
    expires_at DATETIME     NOT NULL,
    used       TINYINT(1)   NOT NULL DEFAULT 0
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS complaints (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    ticket_number   VARCHAR(30)  NOT NULL UNIQUE,
    user_id         BIGINT       NOT NULL,
    category        VARCHAR(100) NOT NULL,
    subject         VARCHAR(255) NOT NULL,
    description     TEXT         NOT NULL,
    priority        VARCHAR(20)  NOT NULL DEFAULT 'Medium',
    status          VARCHAR(20)  NOT NULL DEFAULT 'PENDING',
    ai_response     TEXT,
    ai_responded_at DATETIME,
    created_at      DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS feedback (
    id           BIGINT AUTO_INCREMENT PRIMARY KEY,
    complaint_id BIGINT NOT NULL UNIQUE,
    rating       INT    NOT NULL,
    comment      TEXT,
    created_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (complaint_id) REFERENCES complaints(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Verify
SHOW TABLES;
SELECT 'Database setup complete!' AS status;
