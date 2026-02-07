const db = require("./Model");

async function fixAdmin() {
    try {
        console.log("Iniciando reparación de permisos para el usuario 11...");

        // 1. Buscar o Crear la función 'ADMINISTRADOR DEL SISTEMA'
        const [adminRole, created] = await db.nameFuction.findOrCreate({
            where: { accessLevel: 'Admin' },
            defaults: {
                name: 'ADMINISTRADOR DEL SISTEMA',
                accessLevel: 'Admin',
                order: 0
            }
        });

        console.log(created ? "Rol Admin creado." : "Rol Admin encontrado:", adminRole.id);

        // 2. Asignar este rol al trabajador con ID 11
        const worker = await db.worker.findByPk(11);

        if (!worker) {
            console.error("❌ NO EXISTE EL TRABAJADOR CON ID 11");
            return;
        }

        worker.idFuction = adminRole.id;
        await worker.save();

        console.log(`✅ ÉXITO: El trabajador "${worker.name} ${worker.surname}" (ID: 11) ahora es ADMIN.`);

        // 3. Asegurar también la tabla Login por si acaso (aunque ya no se usa tanto)
        const login = await db.login.findOne({ where: { idWorker: 11 } });
        if (login) {
            login.role = 'admin';
            await login.save();
            console.log("✅ Tabla Login sincronizada a 'admin'.");
        }

    } catch (error) {
        console.error("Error fatal:", error);
    } finally {
        process.exit();
    }
}

// Ejecutar
fixAdmin();
