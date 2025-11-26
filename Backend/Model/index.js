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

module.exports = db;
