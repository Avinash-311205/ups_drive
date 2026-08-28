CREATE DATABASE IF NOT EXISTS employee_assistant;
USE employee_assistant;

CREATE TABLE Users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('employee', 'hr') NOT NULL DEFAULT 'employee'
);

CREATE TABLE Tasks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  employee_id INT NOT NULL,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  priority ENUM('High', 'Medium', 'Low') DEFAULT 'Medium',
  deadline DATETIME,
  status ENUM('Pending', 'In Progress', 'Completed') DEFAULT 'Pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (employee_id) REFERENCES Users(id)
);

CREATE TABLE Leave_Balance (
  id INT AUTO_INCREMENT PRIMARY KEY,
  employee_id INT NOT NULL,
  total_leave INT DEFAULT 24,
  used_leave INT DEFAULT 0,
  remaining_leave INT DEFAULT 24,
  FOREIGN KEY (employee_id) REFERENCES Users(id)
);

CREATE TABLE Leave_Requests (
  id INT AUTO_INCREMENT PRIMARY KEY,
  employee_id INT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  reason VARCHAR(255),
  status ENUM('Pending', 'Approved', 'Rejected') DEFAULT 'Pending',
  FOREIGN KEY (employee_id) REFERENCES Users(id)
);

CREATE TABLE Learning (
  id INT AUTO_INCREMENT PRIMARY KEY,
  employee_id INT NOT NULL,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  deadline DATETIME,
  status ENUM('Pending', 'In Progress', 'Completed') DEFAULT 'Pending',
  progress INT DEFAULT 0,
  FOREIGN KEY (employee_id) REFERENCES Users(id)
);

CREATE TABLE Onboarding (
  id INT AUTO_INCREMENT PRIMARY KEY,
  employee_id INT NOT NULL,
  task VARCHAR(200) NOT NULL,
  status ENUM('Pending', 'Completed') DEFAULT 'Pending',
  FOREIGN KEY (employee_id) REFERENCES Users(id)
);

CREATE TABLE IT_Tickets (
  id INT AUTO_INCREMENT PRIMARY KEY,
  employee_id INT NOT NULL,
  issue TEXT NOT NULL,
  status ENUM('Open', 'In Progress', 'Resolved') DEFAULT 'Open',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (employee_id) REFERENCES Users(id)
);

CREATE TABLE Notifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  employee_id INT NOT NULL,
  message VARCHAR(255) NOT NULL,
  type VARCHAR(50) DEFAULT 'reminder',
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (employee_id) REFERENCES Users(id)
);
