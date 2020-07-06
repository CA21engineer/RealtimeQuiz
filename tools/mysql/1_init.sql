DROP SCHEMA IF EXISTS sample_database;
CREATE SCHEMA IF NOT EXISTS sample_database;
USE sample_database;

GRANT SELECT ON *.* to 'read'@'%' IDENTIFIED BY 'readpass';

CREATE TABLE IF NOT EXISTS `sample_table` (
    `id` varchar(255) NOT NULL,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT IGNORE INTO `sample_table` (`id`) VALUES ("f0c28384-3aa4-3f87-9fba-66a0aa62c504");
