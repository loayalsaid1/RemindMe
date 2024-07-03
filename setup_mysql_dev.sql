-- prepares a MySQL server for the project

CREATE DATABASE IF NOT EXISTS remind_me_dev_db;
CREATE USER IF NOT EXISTS 'remind_me_dev'@'localhost' IDENTIFIED BY 'Remind_me';
GRANT ALL PRIVILEGES ON `remind_me_dev_db`.* TO 'remind_me_dev'@'localhost';
GRANT SELECT ON `performance_schema`.* TO 'remind_me_dev'@'localhost';
FLUSH PRIVILEGES;
