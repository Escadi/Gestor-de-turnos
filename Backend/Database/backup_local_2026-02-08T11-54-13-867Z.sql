-- Time Beep Database Backup
-- Generated at: 2026-02-08T11:54:12.221Z

SET FOREIGN_KEY_CHECKS = 0;

-- Table structure for table `abences`
DROP TABLE IF EXISTS `abences`;
CREATE TABLE `abences` (
  `id` int NOT NULL AUTO_INCREMENT,
  `typeAbences` varchar(255) DEFAULT NULL,
  `timeStart` varchar(255) DEFAULT NULL,
  `timeEnd` varchar(255) DEFAULT NULL,
  `details` varchar(255) DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  `idWorker` int DEFAULT NULL,
  `applicationDate` datetime DEFAULT NULL,
  `filename` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idWorker` (`idWorker`),
  CONSTRAINT `abences_ibfk_1` FOREIGN KEY (`idWorker`) REFERENCES `worker` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8;

-- Dumping data for table `abences`
INSERT INTO `abences` (`id`, `typeAbences`, `timeStart`, `timeEnd`, `details`, `status`, `idWorker`, `applicationDate`, `filename`) VALUES (3, 'Asuntos propios', '2025-02-20', '2025-02-20', 'Gestiones personales', 'Aprobada', 3, NULL, NULL);
INSERT INTO `abences` (`id`, `typeAbences`, `timeStart`, `timeEnd`, `details`, `status`, `idWorker`, `applicationDate`, `filename`) VALUES (6, 'Baja médica', '2025-04-05', '2025-04-10', 'Lesión leva', 'Aprobada', 3, NULL, NULL);
INSERT INTO `abences` (`id`, `typeAbences`, `timeStart`, `timeEnd`, `details`, `status`, `idWorker`, `applicationDate`, `filename`) VALUES (7, 'Asuntos propios', '2025-04-18', '2025-04-18', 'Cita administrativa', 'Aprobada', 4, NULL, NULL);
INSERT INTO `abences` (`id`, `typeAbences`, `timeStart`, `timeEnd`, `details`, `status`, `idWorker`, `applicationDate`, `filename`) VALUES (8, 'Falta injustificada', '2025-05-02', '2025-05-02', 'No presentó justificante', 'Rechazada', 5, NULL, NULL);
INSERT INTO `abences` (`id`, `typeAbences`, `timeStart`, `timeEnd`, `details`, `status`, `idWorker`, `applicationDate`, `filename`) VALUES (10, 'Baja médica', '2025-06-20', '2025-06-22', 'Migraña', 'Aprobada', 10, NULL, NULL);
INSERT INTO `abences` (`id`, `typeAbences`, `timeStart`, `timeEnd`, `details`, `status`, `idWorker`, `applicationDate`, `filename`) VALUES (11, 'salida', '2026-02-05T19:24:15.796Z', '2026-02-05T19:24:15.796Z', 'mi salisa', 'Pendiente', 11, '2026-02-05 19:24:35', 'file-1770319476169-161525865.jpg');
INSERT INTO `abences` (`id`, `typeAbences`, `timeStart`, `timeEnd`, `details`, `status`, `idWorker`, `applicationDate`, `filename`) VALUES (12, 'retraso trafico', '2026-02-06T13:38:17.060Z', '2026-02-06T13:38:17.060Z', 'trafico carretera', 'Pendiente', 1, '2026-02-06 13:38:34', NULL);
INSERT INTO `abences` (`id`, `typeAbences`, `timeStart`, `timeEnd`, `details`, `status`, `idWorker`, `applicationDate`, `filename`) VALUES (13, 'Baja medica', '2026-02-07T17:51:19.006Z', '2026-02-11T22:51:00', '', 'Pendiente', 2, '2026-02-07 17:51:42', NULL);

-- Table structure for table `departament`
DROP TABLE IF EXISTS `departament`;
CREATE TABLE `departament` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8;

-- Dumping data for table `departament`
INSERT INTO `departament` (`id`, `name`) VALUES (1, 'Informatica');
INSERT INTO `departament` (`id`, `name`) VALUES (2, 'Dirección');
INSERT INTO `departament` (`id`, `name`) VALUES (3, 'Recepción');
INSERT INTO `departament` (`id`, `name`) VALUES (4, 'Pisos');
INSERT INTO `departament` (`id`, `name`) VALUES (5, 'Cocina');
INSERT INTO `departament` (`id`, `name`) VALUES (6, 'Restaurante');
INSERT INTO `departament` (`id`, `name`) VALUES (7, 'Mantenimiento');
INSERT INTO `departament` (`id`, `name`) VALUES (8, 'Animación');
INSERT INTO `departament` (`id`, `name`) VALUES (9, 'Comercial');
INSERT INTO `departament` (`id`, `name`) VALUES (10, 'RRHH');
INSERT INTO `departament` (`id`, `name`) VALUES (11, 'Administración');

-- Table structure for table `login`
DROP TABLE IF EXISTS `login`;
CREATE TABLE `login` (
  `idWorker` int NOT NULL,
  `username` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `role` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`idWorker`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `username_2` (`username`),
  UNIQUE KEY `username_3` (`username`),
  UNIQUE KEY `username_4` (`username`),
  UNIQUE KEY `username_5` (`username`),
  UNIQUE KEY `username_6` (`username`),
  UNIQUE KEY `username_7` (`username`),
  UNIQUE KEY `username_8` (`username`),
  UNIQUE KEY `username_9` (`username`),
  UNIQUE KEY `username_10` (`username`),
  UNIQUE KEY `username_11` (`username`),
  UNIQUE KEY `username_12` (`username`),
  UNIQUE KEY `username_13` (`username`),
  UNIQUE KEY `username_14` (`username`),
  UNIQUE KEY `username_15` (`username`),
  UNIQUE KEY `username_16` (`username`),
  UNIQUE KEY `username_17` (`username`),
  UNIQUE KEY `username_18` (`username`),
  UNIQUE KEY `username_19` (`username`),
  UNIQUE KEY `username_20` (`username`),
  UNIQUE KEY `username_21` (`username`),
  UNIQUE KEY `username_22` (`username`),
  UNIQUE KEY `username_23` (`username`),
  UNIQUE KEY `username_24` (`username`),
  UNIQUE KEY `username_25` (`username`),
  UNIQUE KEY `username_26` (`username`),
  UNIQUE KEY `username_27` (`username`),
  UNIQUE KEY `username_28` (`username`),
  UNIQUE KEY `username_29` (`username`),
  UNIQUE KEY `username_30` (`username`),
  UNIQUE KEY `username_31` (`username`),
  UNIQUE KEY `username_32` (`username`),
  UNIQUE KEY `username_33` (`username`),
  UNIQUE KEY `username_34` (`username`),
  UNIQUE KEY `username_35` (`username`),
  UNIQUE KEY `username_36` (`username`),
  UNIQUE KEY `username_37` (`username`),
  UNIQUE KEY `username_38` (`username`),
  UNIQUE KEY `username_39` (`username`),
  UNIQUE KEY `username_40` (`username`),
  UNIQUE KEY `username_41` (`username`),
  UNIQUE KEY `username_42` (`username`),
  UNIQUE KEY `username_43` (`username`),
  UNIQUE KEY `username_44` (`username`),
  UNIQUE KEY `username_45` (`username`),
  UNIQUE KEY `username_46` (`username`),
  UNIQUE KEY `username_47` (`username`),
  UNIQUE KEY `username_48` (`username`),
  UNIQUE KEY `username_49` (`username`),
  UNIQUE KEY `username_50` (`username`),
  UNIQUE KEY `username_51` (`username`),
  UNIQUE KEY `username_52` (`username`),
  UNIQUE KEY `username_53` (`username`),
  UNIQUE KEY `username_54` (`username`),
  UNIQUE KEY `username_55` (`username`),
  UNIQUE KEY `username_56` (`username`),
  CONSTRAINT `login_ibfk_1` FOREIGN KEY (`idWorker`) REFERENCES `worker` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Dumping data for table `login`
INSERT INTO `login` (`idWorker`, `username`, `password`, `role`) VALUES (1, NULL, '$2b$10$pSj37sGFmEOeluQYjkjslOmtJ1lNuXlL7jXM5I2Epge/3vfubXjP2', 'user');
INSERT INTO `login` (`idWorker`, `username`, `password`, `role`) VALUES (2, NULL, '$2b$10$01rEQetNQANeBf4ANG6YJ.MHRvB3yOtH4Kjl8qfDPsmtNdYsVK3RS', 'user');
INSERT INTO `login` (`idWorker`, `username`, `password`, `role`) VALUES (4, NULL, '$2b$10$qWv.xzI.6vA9OsLn67syNugNdkGQqWqnf9SzX09oLdbxFJtuHL0ly', 'user');
INSERT INTO `login` (`idWorker`, `username`, `password`, `role`) VALUES (6, NULL, '$2b$10$PStzg1mIvL3UrhG8RiAp7u1YTz6t340WkOjRWjQGMiUfMxMloe..y', 'user');
INSERT INTO `login` (`idWorker`, `username`, `password`, `role`) VALUES (9, NULL, '$2b$10$SO/XfQjUhqZm2LMfxphuj.eUKbP9R9lePcEGJRAlkca/l8oQEcjW2', 'user');
INSERT INTO `login` (`idWorker`, `username`, `password`, `role`) VALUES (11, 'admin', '$2b$10$2og.KJabtuCdvdVctSHQD.Zu6RS/Ylwpx6iC.yOizyMC4OlVooOvi', 'admin');

-- Table structure for table `nameFuction`
DROP TABLE IF EXISTS `nameFuction`;
CREATE TABLE `nameFuction` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nameCategory` varchar(255) DEFAULT NULL,
  `accessLevel` varchar(255) DEFAULT 'Empleado',
  `parentId` int DEFAULT NULL,
  `order` int DEFAULT '0' COMMENT 'Orden de visualización en el organigrama',
  PRIMARY KEY (`id`),
  KEY `parentId` (`parentId`),
  CONSTRAINT `nameFuction_ibfk_1` FOREIGN KEY (`parentId`) REFERENCES `nameFuction` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8;

-- Dumping data for table `nameFuction`
INSERT INTO `nameFuction` (`id`, `nameCategory`, `accessLevel`, `parentId`, `order`) VALUES (1, 'Informatica', 'Empleado', 25, 0);
INSERT INTO `nameFuction` (`id`, `nameCategory`, `accessLevel`, `parentId`, `order`) VALUES (2, 'Director de Hotel', 'Dirección', 32, 0);
INSERT INTO `nameFuction` (`id`, `nameCategory`, `accessLevel`, `parentId`, `order`) VALUES (3, 'Subdirector de Hotel', 'Dirección', 2, 0);
INSERT INTO `nameFuction` (`id`, `nameCategory`, `accessLevel`, `parentId`, `order`) VALUES (4, 'Jefe de Relaciones Publicas', 'Supervisor', 29, 0);
INSERT INTO `nameFuction` (`id`, `nameCategory`, `accessLevel`, `parentId`, `order`) VALUES (5, 'Relaciones Publicas', 'Empleado', 4, 0);
INSERT INTO `nameFuction` (`id`, `nameCategory`, `accessLevel`, `parentId`, `order`) VALUES (6, 'Jefe de Recepción', 'Supervisor', 29, 0);
INSERT INTO `nameFuction` (`id`, `nameCategory`, `accessLevel`, `parentId`, `order`) VALUES (7, 'Recepcionista', 'Empleado', 6, 0);
INSERT INTO `nameFuction` (`id`, `nameCategory`, `accessLevel`, `parentId`, `order`) VALUES (8, 'Ayudante de Recepción', 'Empleado', 6, 0);
INSERT INTO `nameFuction` (`id`, `nameCategory`, `accessLevel`, `parentId`, `order`) VALUES (9, 'Conserje Nocturno', 'Empleado', 6, 0);
INSERT INTO `nameFuction` (`id`, `nameCategory`, `accessLevel`, `parentId`, `order`) VALUES (10, 'Botones', 'Empleado', 6, 0);
INSERT INTO `nameFuction` (`id`, `nameCategory`, `accessLevel`, `parentId`, `order`) VALUES (11, 'Gobernanta', 'Supervisor', 29, 0);
INSERT INTO `nameFuction` (`id`, `nameCategory`, `accessLevel`, `parentId`, `order`) VALUES (12, 'Subgobernanta', 'Supervisor', 11, 0);
INSERT INTO `nameFuction` (`id`, `nameCategory`, `accessLevel`, `parentId`, `order`) VALUES (13, 'Camarera de Pisos', 'Empleado', 12, 0);
INSERT INTO `nameFuction` (`id`, `nameCategory`, `accessLevel`, `parentId`, `order`) VALUES (14, 'Valet', 'Empleado', 12, 0);
INSERT INTO `nameFuction` (`id`, `nameCategory`, `accessLevel`, `parentId`, `order`) VALUES (15, 'Lenceria', 'Empleado', 12, 0);
INSERT INTO `nameFuction` (`id`, `nameCategory`, `accessLevel`, `parentId`, `order`) VALUES (16, 'Maitre', 'Supervisor', 29, 0);
INSERT INTO `nameFuction` (`id`, `nameCategory`, `accessLevel`, `parentId`, `order`) VALUES (17, 'Camarero', 'Empleado', 16, 0);
INSERT INTO `nameFuction` (`id`, `nameCategory`, `accessLevel`, `parentId`, `order`) VALUES (18, 'Ayudante de Camarero', 'Empleado', 16, 0);
INSERT INTO `nameFuction` (`id`, `nameCategory`, `accessLevel`, `parentId`, `order`) VALUES (19, 'Barman', 'Empleado', 16, 0);
INSERT INTO `nameFuction` (`id`, `nameCategory`, `accessLevel`, `parentId`, `order`) VALUES (20, 'Jefe de Cocina', 'Supervisor', 29, 0);
INSERT INTO `nameFuction` (`id`, `nameCategory`, `accessLevel`, `parentId`, `order`) VALUES (21, 'Cocinero', 'Empleado', 20, 0);
INSERT INTO `nameFuction` (`id`, `nameCategory`, `accessLevel`, `parentId`, `order`) VALUES (22, 'Ayudante de Cocina', 'Empleado', 20, 0);
INSERT INTO `nameFuction` (`id`, `nameCategory`, `accessLevel`, `parentId`, `order`) VALUES (23, 'Jefe de Mantenimiento', 'Supervisor', 29, 0);
INSERT INTO `nameFuction` (`id`, `nameCategory`, `accessLevel`, `parentId`, `order`) VALUES (24, 'Técnico de Mantenimiento', 'Empleado', 23, 0);
INSERT INTO `nameFuction` (`id`, `nameCategory`, `accessLevel`, `parentId`, `order`) VALUES (25, 'Jefe de Animación', 'Supervisor', 29, 0);
INSERT INTO `nameFuction` (`id`, `nameCategory`, `accessLevel`, `parentId`, `order`) VALUES (26, 'Animador', 'Empleado', 25, 0);
INSERT INTO `nameFuction` (`id`, `nameCategory`, `accessLevel`, `parentId`, `order`) VALUES (27, 'Responsable Comercial', 'Empleado', 30, 0);
INSERT INTO `nameFuction` (`id`, `nameCategory`, `accessLevel`, `parentId`, `order`) VALUES (28, 'Community Manager', 'Empleado', 30, 0);
INSERT INTO `nameFuction` (`id`, `nameCategory`, `accessLevel`, `parentId`, `order`) VALUES (29, 'Responsable de RRHH', 'Jefe de Administración', 3, 0);
INSERT INTO `nameFuction` (`id`, `nameCategory`, `accessLevel`, `parentId`, `order`) VALUES (30, 'Jefe de Administración', 'Supervisor', 29, 0);
INSERT INTO `nameFuction` (`id`, `nameCategory`, `accessLevel`, `parentId`, `order`) VALUES (31, 'Administrativo', 'Empleado', 30, 0);
INSERT INTO `nameFuction` (`id`, `nameCategory`, `accessLevel`, `parentId`, `order`) VALUES (32, 'ADMINISTRADOR DEL SISTEMA', 'Admin', NULL, 0);

-- Table structure for table `request`
DROP TABLE IF EXISTS `request`;
CREATE TABLE `request` (
  `id` int NOT NULL AUTO_INCREMENT,
  `applicationDate` datetime DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  `details` varchar(255) DEFAULT NULL,
  `idWorker` int DEFAULT NULL,
  `idType` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idWorker` (`idWorker`),
  KEY `idType` (`idType`),
  CONSTRAINT `request_ibfk_111` FOREIGN KEY (`idWorker`) REFERENCES `worker` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `request_ibfk_112` FOREIGN KEY (`idType`) REFERENCES `requestType` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8;

-- Dumping data for table `request`
INSERT INTO `request` (`id`, `applicationDate`, `status`, `details`, `idWorker`, `idType`) VALUES (1, '2026-02-06 13:38:55', 'Pendiente', 'diniero', 1, 1);
INSERT INTO `request` (`id`, `applicationDate`, `status`, `details`, `idWorker`, `idType`) VALUES (2, '2025-12-05 10:40:00', 'Aprobada', NULL, 2, 3);
INSERT INTO `request` (`id`, `applicationDate`, `status`, `details`, `idWorker`, `idType`) VALUES (4, '2025-12-12 14:10:00', 'Pendiente', NULL, 4, 4);
INSERT INTO `request` (`id`, `applicationDate`, `status`, `details`, `idWorker`, `idType`) VALUES (5, '2025-12-15 11:25:00', 'Aprobada', NULL, 5, 5);
INSERT INTO `request` (`id`, `applicationDate`, `status`, `details`, `idWorker`, `idType`) VALUES (6, '2025-12-18 09:00:00', 'Pendiente', NULL, 6, 1);
INSERT INTO `request` (`id`, `applicationDate`, `status`, `details`, `idWorker`, `idType`) VALUES (7, '2025-12-22 16:45:00', 'Aprobada', NULL, 7, 2);
INSERT INTO `request` (`id`, `applicationDate`, `status`, `details`, `idWorker`, `idType`) VALUES (8, '2025-12-28 08:50:00', 'Rechazada', NULL, 8, 4);
INSERT INTO `request` (`id`, `applicationDate`, `status`, `details`, `idWorker`, `idType`) VALUES (9, '2026-01-05 07:55:00', 'Pendiente', NULL, 9, 3);
INSERT INTO `request` (`id`, `applicationDate`, `status`, `details`, `idWorker`, `idType`) VALUES (10, '2026-01-14 12:30:00', 'Aprobada', NULL, 10, 5);
INSERT INTO `request` (`id`, `applicationDate`, `status`, `details`, `idWorker`, `idType`) VALUES (12, '2026-02-05 20:37:51', 'Pendiente', 'adios', 11, 5);
INSERT INTO `request` (`id`, `applicationDate`, `status`, `details`, `idWorker`, `idType`) VALUES (13, '2026-02-08 11:35:15', 'Pendiente', 'Quiero que me aumenten el sueldo', 4, 5);

-- Table structure for table `requestType`
DROP TABLE IF EXISTS `requestType`;
CREATE TABLE `requestType` (
  `id` int NOT NULL AUTO_INCREMENT,
  `typeRequest` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;

-- Dumping data for table `requestType`
INSERT INTO `requestType` (`id`, `typeRequest`) VALUES (1, 'Permiso');
INSERT INTO `requestType` (`id`, `typeRequest`) VALUES (2, 'Excedencia');
INSERT INTO `requestType` (`id`, `typeRequest`) VALUES (3, 'Pagas');
INSERT INTO `requestType` (`id`, `typeRequest`) VALUES (4, 'Jornada');
INSERT INTO `requestType` (`id`, `typeRequest`) VALUES (5, 'Retribuciones');

-- Table structure for table `sanctions`
DROP TABLE IF EXISTS `sanctions`;
CREATE TABLE `sanctions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `timeHour` varchar(255) DEFAULT NULL,
  `reason` varchar(255) DEFAULT NULL,
  `grade` varchar(255) DEFAULT NULL,
  `idSanctions` int DEFAULT NULL,
  `idWorker` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idSanctions` (`idSanctions`),
  KEY `idWorker` (`idWorker`),
  CONSTRAINT `sanctions_ibfk_111` FOREIGN KEY (`idSanctions`) REFERENCES `shifts` (`id`),
  CONSTRAINT `sanctions_ibfk_112` FOREIGN KEY (`idWorker`) REFERENCES `worker` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Table structure for table `shifts`
DROP TABLE IF EXISTS `shifts`;
CREATE TABLE `shifts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `date` date NOT NULL,
  `idTimeShift` int NOT NULL,
  `state` enum('BORRADOR','PUBLICADO') DEFAULT 'BORRADOR',
  `locked` tinyint(1) DEFAULT '0',
  `idWorker` int DEFAULT NULL,
  `idTimes` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idTimeShift` (`idTimeShift`),
  KEY `idWorker` (`idWorker`),
  KEY `idTimes` (`idTimes`),
  CONSTRAINT `shifts_ibfk_111` FOREIGN KEY (`idTimeShift`) REFERENCES `timeShifts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `shifts_ibfk_112` FOREIGN KEY (`idWorker`) REFERENCES `worker` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `shifts_ibfk_113` FOREIGN KEY (`idTimes`) REFERENCES `timeShifts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8;

-- Dumping data for table `shifts`
INSERT INTO `shifts` (`id`, `date`, `idTimeShift`, `state`, `locked`, `idWorker`, `idTimes`) VALUES (1, '2026-02-02', 1, 'PUBLICADO', 0, NULL, NULL);
INSERT INTO `shifts` (`id`, `date`, `idTimeShift`, `state`, `locked`, `idWorker`, `idTimes`) VALUES (2, '2026-02-03', 8, 'PUBLICADO', 0, NULL, NULL);
INSERT INTO `shifts` (`id`, `date`, `idTimeShift`, `state`, `locked`, `idWorker`, `idTimes`) VALUES (3, '2026-02-04', 8, 'PUBLICADO', 0, NULL, NULL);
INSERT INTO `shifts` (`id`, `date`, `idTimeShift`, `state`, `locked`, `idWorker`, `idTimes`) VALUES (4, '2026-02-05', 2, 'PUBLICADO', 0, NULL, NULL);
INSERT INTO `shifts` (`id`, `date`, `idTimeShift`, `state`, `locked`, `idWorker`, `idTimes`) VALUES (5, '2026-02-06', 5, 'PUBLICADO', 0, NULL, NULL);
INSERT INTO `shifts` (`id`, `date`, `idTimeShift`, `state`, `locked`, `idWorker`, `idTimes`) VALUES (6, '2026-02-07', 3, 'PUBLICADO', 0, NULL, NULL);
INSERT INTO `shifts` (`id`, `date`, `idTimeShift`, `state`, `locked`, `idWorker`, `idTimes`) VALUES (7, '2026-02-08', 4, 'PUBLICADO', 0, NULL, NULL);

-- Table structure for table `signings`
DROP TABLE IF EXISTS `signings`;
CREATE TABLE `signings` (
  `id` int NOT NULL AUTO_INCREMENT,
  `date` datetime DEFAULT NULL,
  `idWorker` int DEFAULT NULL,
  `lat` float DEFAULT NULL,
  `lng` float DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idWorker` (`idWorker`),
  CONSTRAINT `signings_ibfk_1` FOREIGN KEY (`idWorker`) REFERENCES `worker` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8;

-- Dumping data for table `signings`
INSERT INTO `signings` (`id`, `date`, `idWorker`, `lat`, `lng`) VALUES (1, '2026-02-07 17:39:08', 1, 27.799, -15.6979);
INSERT INTO `signings` (`id`, `date`, `idWorker`, `lat`, `lng`) VALUES (2, '2026-02-07 17:44:24', 1, 27.799, -15.6979);
INSERT INTO `signings` (`id`, `date`, `idWorker`, `lat`, `lng`) VALUES (3, '2026-02-07 17:51:06', 2, 27.799, -15.6979);
INSERT INTO `signings` (`id`, `date`, `idWorker`, `lat`, `lng`) VALUES (4, '2026-02-07 17:51:09', 2, 27.799, -15.6979);
INSERT INTO `signings` (`id`, `date`, `idWorker`, `lat`, `lng`) VALUES (5, '2026-02-07 17:53:09', 2, 27.799, -15.6979);
INSERT INTO `signings` (`id`, `date`, `idWorker`, `lat`, `lng`) VALUES (6, '2026-02-07 17:53:12', 2, 27.799, -15.6979);
INSERT INTO `signings` (`id`, `date`, `idWorker`, `lat`, `lng`) VALUES (7, '2026-02-08 11:52:44', 6, 27.799, -15.6979);

-- Table structure for table `status`
DROP TABLE IF EXISTS `status`;
CREATE TABLE `status` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;

-- Dumping data for table `status`
INSERT INTO `status` (`id`, `name`) VALUES (1, 'Activo');
INSERT INTO `status` (`id`, `name`) VALUES (2, 'Inactivo');
INSERT INTO `status` (`id`, `name`) VALUES (3, 'Vacaciones');
INSERT INTO `status` (`id`, `name`) VALUES (4, 'Baja Medica');
INSERT INTO `status` (`id`, `name`) VALUES (5, 'Permiso');
INSERT INTO `status` (`id`, `name`) VALUES (6, 'Excedencia');

-- Table structure for table `timeShifts`
DROP TABLE IF EXISTS `timeShifts`;
CREATE TABLE `timeShifts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `hours` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8;

-- Dumping data for table `timeShifts`
INSERT INTO `timeShifts` (`id`, `hours`) VALUES (1, '08:00 - 16:00');
INSERT INTO `timeShifts` (`id`, `hours`) VALUES (2, '16:00 - 00:00');
INSERT INTO `timeShifts` (`id`, `hours`) VALUES (3, '00:00 - 08:00');
INSERT INTO `timeShifts` (`id`, `hours`) VALUES (4, '12:00 - 20:00');
INSERT INTO `timeShifts` (`id`, `hours`) VALUES (5, '10:00 - 18:00');
INSERT INTO `timeShifts` (`id`, `hours`) VALUES (6, '14:00 - 22:00');
INSERT INTO `timeShifts` (`id`, `hours`) VALUES (7, '18:00 - 02:00');
INSERT INTO `timeShifts` (`id`, `hours`) VALUES (8, 'Libre');

-- Table structure for table `worker`
DROP TABLE IF EXISTS `worker`;
CREATE TABLE `worker` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `surname` varchar(255) DEFAULT NULL,
  `dni` varchar(255) DEFAULT NULL,
  `registrationDate` datetime DEFAULT NULL,
  `phoneNumber` varchar(255) DEFAULT NULL,
  `idFuction` int DEFAULT NULL,
  `idStatus` int DEFAULT NULL,
  `locked` tinyint(1) NOT NULL DEFAULT '0',
  `imageUrl` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idFuction` (`idFuction`),
  KEY `idStatus` (`idStatus`),
  CONSTRAINT `worker_ibfk_141` FOREIGN KEY (`idFuction`) REFERENCES `nameFuction` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `worker_ibfk_142` FOREIGN KEY (`idStatus`) REFERENCES `status` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8;

-- Dumping data for table `worker`
INSERT INTO `worker` (`id`, `name`, `surname`, `dni`, `registrationDate`, `phoneNumber`, `idFuction`, `idStatus`, `locked`, `imageUrl`, `email`) VALUES (1, 'Carlos', 'Romero Díaz', '12345678A', '2023-01-15 09:00:00', '612345678', 1, 1, 0, NULL, 'carlos.romero@hotel.com');
INSERT INTO `worker` (`id`, `name`, `surname`, `dni`, `registrationDate`, `phoneNumber`, `idFuction`, `idStatus`, `locked`, `imageUrl`, `email`) VALUES (2, 'María', 'González Pérez', '98765432B', '2023-02-20 10:30:00', '622334455', 7, 1, 0, NULL, 'maría.gonzález@hotel.com');
INSERT INTO `worker` (`id`, `name`, `surname`, `dni`, `registrationDate`, `phoneNumber`, `idFuction`, `idStatus`, `locked`, `imageUrl`, `email`) VALUES (3, 'Lucía', 'Martín López', '45678912C', '2023-03-12 08:45:00', '633556677', 5, 1, 0, NULL, 'lucía.martín@hotel.com');
INSERT INTO `worker` (`id`, `name`, `surname`, `dni`, `registrationDate`, `phoneNumber`, `idFuction`, `idStatus`, `locked`, `imageUrl`, `email`) VALUES (4, 'Javier', 'Santos León', '11223344D', '2023-04-03 14:20:00', '644998877', 29, 1, 0, NULL, 'javier.santos@hotel.com');
INSERT INTO `worker` (`id`, `name`, `surname`, `dni`, `registrationDate`, `phoneNumber`, `idFuction`, `idStatus`, `locked`, `imageUrl`, `email`) VALUES (5, 'Elena', 'Suárez Medina', '99887766E', '2023-04-10 12:15:00', '655221133', 21, 1, 0, NULL, 'elena.suárez@hotel.com');
INSERT INTO `worker` (`id`, `name`, `surname`, `dni`, `registrationDate`, `phoneNumber`, `idFuction`, `idStatus`, `locked`, `imageUrl`, `email`) VALUES (6, 'Daniel', 'Hernández Vega', '55667788F', '2023-05-05 09:05:00', '666112233', 31, 1, 0, NULL, 'daniel.hernández@hotel.com');
INSERT INTO `worker` (`id`, `name`, `surname`, `dni`, `registrationDate`, `phoneNumber`, `idFuction`, `idStatus`, `locked`, `imageUrl`, `email`) VALUES (7, 'Fernando', 'Díaz Marrero', '33445566G', '2023-06-07 16:40:00', '677445566', 20, 1, 0, NULL, 'fernando.díaz@hotel.com');
INSERT INTO `worker` (`id`, `name`, `surname`, `dni`, `registrationDate`, `phoneNumber`, `idFuction`, `idStatus`, `locked`, `imageUrl`, `email`) VALUES (8, 'Laura', 'Benítez Ruiz', '22334455H', '2023-06-21 11:50:00', '688778899', 23, 1, 0, NULL, 'laura.benítez@hotel.com');
INSERT INTO `worker` (`id`, `name`, `surname`, `dni`, `registrationDate`, `phoneNumber`, `idFuction`, `idStatus`, `locked`, `imageUrl`, `email`) VALUES (9, 'Ainhoa', 'Ramírez Torres', '88776655J', '2023-07-01 07:30:00', '699887766', 30, 1, 0, NULL, 'ainhoa.ramírez@hotel.com');
INSERT INTO `worker` (`id`, `name`, `surname`, `dni`, `registrationDate`, `phoneNumber`, `idFuction`, `idStatus`, `locked`, `imageUrl`, `email`) VALUES (10, 'Pablo', 'Castro Morales', '44556677K', '2023-07-15 13:10:00', '611223344', 20, 1, 0, NULL, 'pablo.castro@hotel.com');
INSERT INTO `worker` (`id`, `name`, `surname`, `dni`, `registrationDate`, `phoneNumber`, `idFuction`, `idStatus`, `locked`, `imageUrl`, `email`) VALUES (11, 'admin', 'admin', '00000000X', '2026-01-23 10:00:00', '000000000', 32, 1, 0, NULL, 'admin.admin@hotel.com');

-- Table structure for table `workerShift`
DROP TABLE IF EXISTS `workerShift`;
CREATE TABLE `workerShift` (
  `idWorker` int NOT NULL,
  `idShift` int NOT NULL,
  PRIMARY KEY (`idWorker`,`idShift`),
  KEY `idShift` (`idShift`),
  CONSTRAINT `workerShift_ibfk_1` FOREIGN KEY (`idWorker`) REFERENCES `worker` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `workerShift_ibfk_2` FOREIGN KEY (`idShift`) REFERENCES `shifts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Dumping data for table `workerShift`
INSERT INTO `workerShift` (`idWorker`, `idShift`) VALUES (6, 1);
INSERT INTO `workerShift` (`idWorker`, `idShift`) VALUES (6, 2);
INSERT INTO `workerShift` (`idWorker`, `idShift`) VALUES (6, 3);
INSERT INTO `workerShift` (`idWorker`, `idShift`) VALUES (6, 4);
INSERT INTO `workerShift` (`idWorker`, `idShift`) VALUES (6, 5);
INSERT INTO `workerShift` (`idWorker`, `idShift`) VALUES (6, 6);
INSERT INTO `workerShift` (`idWorker`, `idShift`) VALUES (6, 7);

SET FOREIGN_KEY_CHECKS = 1;
