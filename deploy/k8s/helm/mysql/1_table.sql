DROP SCHEMA IF EXISTS infra-test;

CREATE SCHEMA infra-test;

USE infra-test;

CREATE TABLE `test_db` (
  `id` varchar(255) NOT NULL PRIMARY KEY
);
