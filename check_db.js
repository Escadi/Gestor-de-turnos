const db = require('./backend/Model');

async function listUsers() {
    try {
        await db.sequelize.authenticate();
        console.log('Connection has been established successfully.');

        const logins = await db.login.findAll({
            include: [{
                model: db.worker,
                as: 'worker'
            }]
        });
        console.log('--- LOGINS ---');
        console.log(JSON.stringify(logins, null, 2));

        const workers = await db.worker.findAll();
        console.log('--- WORKERS ---');
        console.log(JSON.stringify(workers, null, 2));

        const functions = await db.nameFuction.findAll();
        console.log('--- FUNCTIONS ---');
        console.log(JSON.stringify(functions, null, 2));
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    } finally {
        await db.sequelize.close();
    }
}

listUsers();
