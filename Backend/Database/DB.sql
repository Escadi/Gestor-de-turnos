INSERT INTO nameFuction (nameCategory) VALUES
('Informatica'),
('Director de Hotel'),
('Subdirector de Hotel'),
('Jefe de Relaciones Publicas'),
('Relaciones Publicas'),
('Jefe de Recepción'),
('Recepcionista'),
('Ayudante de Recepción'),
('Conserje Nocturno'),
('Botones'),
('Gobernanta'),
('Subgobernanta'),
('Camarera de Pisos'),
('Valet'),
('Lenceria'),
('Maitre'),
('Camarero'),
('Ayudante de Camarero'),
('Barman'),
('Jefe de Cocina'),
('Cocinero'),
('Ayudante de Cocina'),
('Jefe de Mantenimiento'),
('Técnico de Mantenimiento'),
('Jefe de Animación'),
('Animador'),
('Responsable Comercial'),
('Community Manager'),
('Responsable de RRHH'),
('Jefe de Administración'),
('Administrativo');

INSERT INTO worker (name, surname, dni, registrationDate, phoneNumber, idFuction) VALUES
('Carlos', 'Romero Díaz', '12345678A', '2023-01-15 09:00:00', '612345678', 1),
('María', 'González Pérez', '98765432B', '2023-02-20 10:30:00', '622334455', 7),  
('Lucía', 'Martín López', '45678912C', '2023-03-12 08:45:00', '633556677', 5),  
('Javier', 'Santos León', '11223344D', '2023-04-03 14:20:00', '644998877', 4),  
('Elena', 'Suárez Medina', '99887766E', '2023-04-10 12:15:00', '655221133', 21), 
('Daniel', 'Hernández Vega', '55667788F', '2023-05-05 09:05:00', '666112233', 10), 
('Fernando', 'Díaz Marrero', '33445566G', '2023-06-07 16:40:00', '677445566', 20), 
('Laura', 'Benítez Ruiz', '22334455H', '2023-06-21 11:50:00', '688778899', 23),  
('Ainhoa', 'Ramírez Torres', '88776655J', '2023-07-01 07:30:00', '699887766', 27), 
('Pablo', 'Castro Morales', '44556677K', '2023-07-15 13:10:00', '611223344', 20),
('admin', 'admin', '00000000X', '2026-01-23 10:00:00', '000000000', 1);

INSERT INTO timeShifts(hours) VALUES
("08:00 - 16:00"),
("16:00 - 00:00"),
("00:00 - 08:00"),
("12:00 - 20:00"),
("10:00 - 18:00"),
("14:00 - 22:00"),
("18:00 - 02:00"),
("Libre");



INSERT INTO status (name) VALUES
("Activo"),
("Inactivo"),
("Vacaciones"),
("Baja Medica"),
("Permiso"),
("Excedencia");

INSERT INTO requestType (typeRequest) VALUES
("Permiso"),
("Excedencia"),
("Pagas"),
("Jornada"),
("Retribuciones");

INSERT INTO request (applicationDate, status, idWorker, idType) VALUES
('2025-12-02 09:15:00', 'Pendiente', 1, 1),
('2025-12-05 10:40:00', 'Aprobada', 2, 3),
('2025-12-08 08:30:00', 'Rechazada', 3, 2),
('2025-12-12 14:10:00', 'Pendiente', 4, 4),
('2025-12-15 11:25:00', 'Aprobada', 5, 5),
('2025-12-18 09:00:00', 'Pendiente', 6, 1),
('2025-12-22 16:45:00', 'Aprobada', 7, 2),
('2025-12-28 08:50:00', 'Rechazada', 8, 4),
('2026-01-05 07:55:00', 'Pendiente', 9, 3),
('2026-01-14 12:30:00', 'Aprobada', 10, 5);


INSERT INTO departament (name) VALUES
('Informatica'),
('Dirección'),
('Recepción'),
('Pisos'),
('Cocina'),
('Restaurante'),
('Mantenimiento'),
('Animación'),
('Comercial'),
('RRHH'),
('Administración');

INSERT INTO login (idWorker, username, password, role) VALUES
(11, 'admin', '$2a$12$tCY/.PEb7MdJtnK157iX2ezROG.woPOFNlzthSh1Khm/FeHa4bP4O', 'admin');




