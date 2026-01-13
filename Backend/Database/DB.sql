INSERT INTO nameFuction (nameCategory) VALUES
('Director de Hotel'),
('Subdirector de Hotel'),
('Administrativo'),
('Jefe de Recepción'),
('Recepcionista'),
('Ayudante de Recepción'),
('Conserje'),
('Botones'),
('Gobernanta'),
('Subgobernanta'),
('Camarera de Pisos'),
('Lavandero'),
('Jefe de Sala'),
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
('Vigilante de Seguridad'),
('Responsable Comercial'),
('Community Manager'),
('Responsable de RRHH');

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
('Pablo', 'Castro Morales', '44556677K', '2023-07-15 13:10:00', '611223344', 20);

INSERT INTO timeShifts(hours) VALUES
("08:00 - 16:00"),
("16:00 - 00:00"),
("00:00 - 08:00"),
("12:00 - 20:00"),
("10:00 - 18:00"),
("14:00 - 22:00"),
("18:00 - 02:00"),
("Libre");



INSERT INTO status (name) values
("Activo"),
("Inactivo"),
("Vacaciones"),
("Baja Medica"),
("Permiso"),
("Excedencia");


