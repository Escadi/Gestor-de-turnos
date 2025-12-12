-- ================================================================================
-- DATABASE SCHEMA FOR GESTOR DE TURNOS (SHIFT MANAGEMENT SYSTEM)
-- ================================================================================
-- This file contains all table creation statements with proper primary keys,
-- foreign keys, and constraints. Tables are ordered to respect dependencies.
-- ================================================================================

-- Drop existing database if exists and create new one
DROP DATABASE IF EXISTS gestor_turnos;

CREATE DATABASE gestor_turnos CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE gestor_turnos;

-- ================================================================================
-- INDEPENDENT TABLES (No foreign key dependencies)
-- ================================================================================

-- Table: nameFuctions
-- Description: Stores job function/category names for workers
CREATE TABLE nameFuctions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nameCategory VARCHAR(255) NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_nameCategory (nameCategory)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- Table: requestTypes
-- Description: Stores types of requests that workers can make
CREATE TABLE requestTypes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    typeRequest VARCHAR(255) NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_typeRequest (typeRequest)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- Table: timeShifts
-- Description: Stores available shift time slots/hours
CREATE TABLE timeShifts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    hours VARCHAR(255) NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_hours (hours)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- ================================================================================
-- DEPENDENT TABLES - LEVEL 1 (Depend on independent tables)
-- ================================================================================

-- Table: workers
-- Description: Stores worker/employee information
CREATE TABLE workers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    surname VARCHAR(255) NOT NULL,
    dni VARCHAR(20) UNIQUE NOT NULL,
    registrationDate DATETIME NOT NULL,
    phoneNumber VARCHAR(20),
    idFuction INT NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

-- Foreign Keys
CONSTRAINT fk_worker_nameFuction FOREIGN KEY (idFuction) REFERENCES nameFuctions (id) ON DELETE CASCADE ON UPDATE CASCADE,

-- Indexes
INDEX idx_dni (dni),
    INDEX idx_name_surname (name, surname),
    INDEX idx_idFuction (idFuction)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================================================
-- DEPENDENT TABLES - LEVEL 2 (Depend on workers table)
-- ================================================================================

-- Table: logins
-- Description: Stores login credentials and roles for workers
CREATE TABLE logins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    idWorker INT UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

-- Foreign Keys
CONSTRAINT fk_login_worker FOREIGN KEY (idWorker) REFERENCES workers (id) ON DELETE CASCADE ON UPDATE CASCADE,

-- Indexes
INDEX idx_idWorker (idWorker),
    INDEX idx_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: shifts
-- Description: Stores shift assignments for workers
CREATE TABLE shifts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    date DATETIME NOT NULL,
    idWorker INT NOT NULL,
    idTimes INT NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

-- Foreign Keys
CONSTRAINT fk_shifts_worker FOREIGN KEY (idWorker) REFERENCES workers (id) ON DELETE CASCADE ON UPDATE CASCADE,
CONSTRAINT fk_shifts_timeShifts FOREIGN KEY (idTimes) REFERENCES timeShifts (id) ON DELETE CASCADE ON UPDATE CASCADE,

-- Indexes
INDEX idx_date (date),
    INDEX idx_idWorker (idWorker),
    INDEX idx_idTimes (idTimes),
    INDEX idx_worker_date (idWorker, date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: requests
-- Description: Stores worker requests (vacation, time off, etc.)
CREATE TABLE requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    applicationDate DATETIME NOT NULL,
    status VARCHAR(50) NOT NULL,
    idWorker INT NOT NULL,
    idType INT NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

-- Foreign Keys
CONSTRAINT fk_request_worker FOREIGN KEY (idWorker) REFERENCES workers (id) ON DELETE CASCADE ON UPDATE CASCADE,
CONSTRAINT fk_request_requestType FOREIGN KEY (idType) REFERENCES requestTypes (id) ON DELETE CASCADE ON UPDATE CASCADE,

-- Indexes
INDEX idx_applicationDate (applicationDate),
    INDEX idx_status (status),
    INDEX idx_idWorker (idWorker),
    INDEX idx_idType (idType),
    INDEX idx_worker_status (idWorker, status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: abences
-- Description: Stores worker absences with details
CREATE TABLE abences (
    id INT AUTO_INCREMENT PRIMARY KEY,
    typeAbences VARCHAR(255) NOT NULL,
    timeStart VARCHAR(255) NOT NULL,
    timeEnd VARCHAR(255) NOT NULL,
    details TEXT,
    idWorker INT NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

-- Foreign Keys
CONSTRAINT fk_abences_worker FOREIGN KEY (idWorker) REFERENCES workers (id) ON DELETE CASCADE ON UPDATE CASCADE,

-- Indexes
INDEX idx_typeAbences (typeAbences),
    INDEX idx_idWorker (idWorker),
    INDEX idx_timeStart (timeStart),
    INDEX idx_timeEnd (timeEnd)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: sanctions
-- Description: Stores worker sanctions/penalties
CREATE TABLE sanctions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    timeHour VARCHAR(255),
    reason TEXT NOT NULL,
    grade VARCHAR(50) NOT NULL,
    idWorker INT NOT NULL,
    idSanctions INT,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

-- Foreign Keys
CONSTRAINT fk_sanctions_worker FOREIGN KEY (idWorker) REFERENCES workers (id) ON DELETE CASCADE ON UPDATE CASCADE,
CONSTRAINT fk_sanctions_shifts FOREIGN KEY (idSanctions) REFERENCES shifts (id) ON DELETE SET NULL ON UPDATE CASCADE,

-- Indexes
INDEX idx_grade (grade),
    INDEX idx_idWorker (idWorker),
    INDEX idx_idSanctions (idSanctions)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;