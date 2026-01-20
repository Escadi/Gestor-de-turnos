const db = require("./Model");
const Worker = db.worker;
const Login = db.login;
const NameFuction = db.nameFuction;
const Status = db.status;

async function createAdmin() {
    try {
        console.log("Conectando con la base de datos...");
        await db.sequelize.authenticate();

        // 1. Asegurar Función Administrador
        console.log("Comprobando funciones...");
        const [fuction] = await NameFuction.findOrCreate({
            where: { nameCategory: 'ADMINISTRACION' }
        });

        // 2. Asegurar Status Activo
        console.log("Comprobando estados...");
        const [status] = await Status.findOrCreate({
            where: { name: 'ACTIVO' }
        });

        // 3. Crear Worker Admin si no existe (por DNI)
        console.log("Comprobando trabajador admin...");
        let adminWorker = await Worker.findOne({ where: { dni: '00000000X' } });

        if (!adminWorker) {
            adminWorker = await Worker.create({
                name: 'Admin',
                surname: 'Sistema',
                dni: '00000000X',
                registrationDate: new Date(),
                idFuction: fuction.id,
                idStatus: status.id
            });
            console.log("Trabajador Admin creado.");
        }

        // 4. Crear o Actualizar Login (esto activará el hook de encriptación)
        console.log("Configurando login con contraseña encriptada...");
        const [loginRecord, created] = await Login.findOrCreate({
            where: { idWorker: adminWorker.id },
            defaults: {
                username: 'admin',
                password: 'admin', // Se encriptará por el hook setter
                role: 'admin'
            }
        });

        if (!created) {
            // Si ya existe, forzar actualización para aplicar encriptación si era texto plano
            loginRecord.username = 'admin';
            loginRecord.password = 'admin';
            loginRecord.role = 'admin';
            await loginRecord.save();
            console.log("Login de Admin actualizado (username 'admin' y contraseña re-encriptada).");
        } else {
            console.log("Login de Admin creado.");
        }

        console.log("\n========================================");
        console.log(` ADMIN CREADO / ACTUALIZADO CORRECTAMENTE`);
        console.log(` ID de empleado: ${adminWorker.id}`);
        console.log(` Contraseña: admin`);
        console.log("========================================\n");

    } catch (err) {
        console.error("Error creando el usuario admin:", err);
    } finally {
        await db.sequelize.close();
        process.exit();
    }
}

createAdmin();
