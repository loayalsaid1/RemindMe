-- prepares a MySQL server for the project

CREATE DATABASE IF NOT EXISTS remind_me_test_db;
CREATE USER IF NOT EXISTS 'remind_me_test'@'localhost' IDENTIFIED BY 'Remind_me_test_pwd1';
GRANT ALL PRIVILEGES ON `remind_me_test_db`.* TO 'remind_me_test'@'localhost';
GRANT SELECT ON `performance_schema`.* TO 'remind_me_test'@'localhost';
FLUSH PRIVILEGES;
