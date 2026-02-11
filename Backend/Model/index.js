const configDB = require('../Config/configDB.js');

const Sequelize = require('sequelize');

const sequelize = new Sequelize(
    configDB.DB,
    configDB.USER,
    configDB.PASSWORD,
    {
        host: configDB.HOST,
        dialect: configDB.dialect,
        logging: false,
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false
            }
        },
        define: {
            freezeTableName: true,
            timestamps: false
        },

        pool: {
            max: configDB.pool.max,
            min: configDB.pool.min,
            acquire: configDB.pool.acquire,
            idle: configDB.pool.idle
        }
    });

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;


db.nameFuction = require('./NameFuction.js')(sequelize, Sequelize);
db.worker = require('./Worker.js')(sequelize, Sequelize);
db.login = require('./Login.js')(sequelize, Sequelize);
db.shifts = require('./Shifts.js')(sequelize, Sequelize);
db.timeShifts = require('./TimeShifts.js')(sequelize, Sequelize);
db.requestType = require('./RequestTipe.js')(sequelize, Sequelize);
db.request = require('./Request.js')(sequelize, Sequelize);
db.abences = require('./Abences.js')(sequelize, Sequelize);
db.sanction = require('./Sanction.js')(sequelize, Sequelize);
db.workerShift = require('./WokerShift.js')(sequelize, Sequelize);
db.signing = require('./Signing.js')(sequelize, Sequelize);
db.status = require('./Status.js')(sequelize, Sequelize);
db.password_resets = require('./Password_resets.js')(sequelize, Sequelize);

// INITIALIZE ALL ASSOCIATIONS FOR THE DATABASE WHIT FOREING KEYS
Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

module.exports = db;
