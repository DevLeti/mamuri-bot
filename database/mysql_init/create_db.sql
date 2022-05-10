CREATE DATABASE mamuri_db;

USE mamuri_db;

CREATE TABLE user
(
    id      INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL
);

CREATE TABLE keyword
(
    id      INT     NOT NULL AUTO_INCREMENT PRIMARY KEY,
    keyword VARCHAR NULL
);

CREATE TABLE user_keyword
(
    id         INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    user_id    INT NOT NULL,
    keyword_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES user (id) ON DELETE CASCADE,
    FOREIGN KEY (keyword_id) REFERENCES keyword (id) ON DELETE CASCADE,
);

CREATE TABLE item
(
    id            INT      NOT NULL AUTO_INCREMENT PRIMARY KEY,
    keyword_id    INT      NOT NULL,
    platform      VARCHAR  NOT NULL,
    name          VARCHAR  NOT NULL,
    price         INT      NOT NULL,
    thumbnail_url VARCHAR  NULL,
    item_url      VARCHAR  NOT NULL,
    extra_info    TEXT     NULL,
    created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE item_check
(
    id      INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    item_id INT NULL,
    user_id INT NULL,
    FOREIGN KEY (item_id) REFERENCES item (id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES user (id) ON DELETE CASCADE
);
