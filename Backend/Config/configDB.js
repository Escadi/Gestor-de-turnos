module.exports = {
    HOST: process.env.DB_HOST || "b2czmau1g7wuoeqiyyyp-mysql.services.clever-cloud.com",
    USER: process.env.DB_USER || "uviwabetcujcs4bb",
    PASSWORD: process.env.DB_PASSWORD || "oCjL3uMjAhLyxHaTirtV",
    DB: process.env.DB_NAME || "b2czmau1g7wuoeqiyyyp",
    dialect: "mysql",
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
};