const configDB = require('../config/configDB.js');

const Sequelize = require('sequelize');

const sequelize = new Sequelize(
    configDB.DB,
    configDB.USER,
    configDB.PASSWORD,
    {
        host: configDB.HOST,
        dialect: configDB.dialect,
        logging: false,
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
db.times = require('./Times.js')(sequelize, Sequelize);
db.request = require('./Request.js')(sequelize, Sequelize);
db.absence = require('./Absence.js')(sequelize, Sequelize);

module.exports = db;
