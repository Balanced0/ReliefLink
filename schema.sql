CREATE DATABASE IF NOT EXISTS relieflink;
USE relieflink;

CREATE TABLE users (
    user_id           INT AUTO_INCREMENT PRIMARY KEY,
    name              VARCHAR(100) NOT NULL,
    email             VARCHAR(150) NOT NULL UNIQUE,
    password_hash     VARCHAR(255) NOT NULL,
    role              ENUM('affected', 'volunteer', 'admin') NOT NULL DEFAULT 'affected',
    account_type      ENUM('individual', 'organization_member') NOT NULL DEFAULT 'individual',
    account_status    ENUM('active', 'suspended') NOT NULL DEFAULT 'active',
    created_at        TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE organizations (
    org_id          INT AUTO_INCREMENT PRIMARY KEY,
    org_name        VARCHAR(150) NOT NULL UNIQUE,
    description     TEXT NULL,
    owner_user_id   INT NOT NULL,
    created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_org_owner FOREIGN KEY (owner_user_id) REFERENCES users(user_id) ON DELETE RESTRICT
);

CREATE TABLE joins (
    user_id        INT NOT NULL,
    org_id         INT NOT NULL,
    status         ENUM('pending', 'approved', 'rejected') NOT NULL DEFAULT 'pending',
    requested_at   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, org_id),
    CONSTRAINT fk_joins_org  FOREIGN KEY (org_id)  REFERENCES organizations(org_id) ON DELETE CASCADE,
    CONSTRAINT fk_joins_user FOREIGN KEY (user_id) REFERENCES users(user_id)        ON DELETE CASCADE
);

CREATE TABLE areas (
    area_id     INT AUTO_INCREMENT PRIMARY KEY,
    area_name   VARCHAR(100) NOT NULL UNIQUE,
    district    VARCHAR(100) NOT NULL
);

CREATE TABLE needs (
    need_id       INT AUTO_INCREMENT PRIMARY KEY,
    posted_by     INT NOT NULL,
    category      ENUM('food', 'medicine', 'shelter', 'rescue', 'other') NOT NULL,
    area_id       INT NOT NULL,
    urgency       ENUM('low', 'medium', 'high', 'critical') NOT NULL DEFAULT 'medium',
    description   TEXT NOT NULL,
    quantity      VARCHAR(100) NULL,
    status        ENUM('open', 'claimed', 'fulfilled') NOT NULL DEFAULT 'open',
    is_hidden     BOOLEAN NOT NULL DEFAULT FALSE,
    created_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_needs_user FOREIGN KEY (posted_by) REFERENCES users(user_id) ON DELETE CASCADE,
    CONSTRAINT fk_needs_area FOREIGN KEY (area_id)   REFERENCES areas(area_id) ON DELETE RESTRICT
);

CREATE TABLE claims (
    claim_id      INT AUTO_INCREMENT PRIMARY KEY,
    need_id       INT NOT NULL,
    volunteer_id  INT NOT NULL,
    status        ENUM('active', 'fulfilled', 'cancelled') NOT NULL DEFAULT 'active',
    claimed_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fulfilled_at  TIMESTAMP NULL,
    CONSTRAINT fk_claims_need      FOREIGN KEY (need_id)      REFERENCES needs(need_id) ON DELETE CASCADE,
    CONSTRAINT fk_claims_volunteer FOREIGN KEY (volunteer_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE comments_on (
    comment_id  INT AUTO_INCREMENT PRIMARY KEY,
    need_id     INT NOT NULL,
    user_id     INT NOT NULL,
    content     VARCHAR(500) NOT NULL,
    created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_comments_need FOREIGN KEY (need_id) REFERENCES needs(need_id) ON DELETE CASCADE,
    CONSTRAINT fk_comments_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE rates (
    rating_id       INT AUTO_INCREMENT PRIMARY KEY,
    rated_by        INT NOT NULL,
    rated_user_id   INT NOT NULL,
    stars           TINYINT NOT NULL,
    comment         VARCHAR(500) NULL,
    CONSTRAINT fk_rates_rated_by   FOREIGN KEY (rated_by)      REFERENCES users(user_id) ON DELETE CASCADE,
    CONSTRAINT fk_rates_rated_user FOREIGN KEY (rated_user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    CONSTRAINT chk_rates_stars     CHECK (stars BETWEEN 1 AND 5)
);

CREATE TABLE logs_contribution (
    contribution_id  INT AUTO_INCREMENT PRIMARY KEY,
    volunteer_id     INT NOT NULL,
    need_id          INT NOT NULL,
    fulfilled_at     TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_logs_volunteer FOREIGN KEY (volunteer_id) REFERENCES users(user_id) ON DELETE CASCADE,
    CONSTRAINT fk_logs_need      FOREIGN KEY (need_id)      REFERENCES needs(need_id) ON DELETE CASCADE
);

CREATE TABLE bookmarks (
    user_id      INT NOT NULL,
    area_id      INT NOT NULL,
    created_at   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, area_id),
    CONSTRAINT fk_bookmarks_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    CONSTRAINT fk_bookmarks_area FOREIGN KEY (area_id) REFERENCES areas(area_id) ON DELETE CASCADE
);

CREATE TABLE reports (
    need_id      INT NOT NULL,
    reported_by  INT NOT NULL,
    reason       VARCHAR(255) NULL,
    resolved     BOOLEAN NOT NULL DEFAULT FALSE,
    created_at   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (need_id, reported_by),
    CONSTRAINT fk_reports_need     FOREIGN KEY (need_id)     REFERENCES needs(need_id) ON DELETE CASCADE,
    CONSTRAINT fk_reports_reporter FOREIGN KEY (reported_by) REFERENCES users(user_id) ON DELETE CASCADE
);