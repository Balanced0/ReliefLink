ALTER TABLE needs DROP COLUMN category;

CREATE TABLE need_categories (
    need_id   INT NOT NULL,
    category  ENUM('food', 'medicine', 'shelter', 'rescue', 'other') NOT NULL,
    PRIMARY KEY (need_id, category),
    CONSTRAINT fk_needcat_need FOREIGN KEY (need_id) REFERENCES needs(need_id) ON DELETE CASCADE
);