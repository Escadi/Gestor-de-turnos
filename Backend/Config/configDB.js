module.exports = {
    HOST: "localhost",
    //HOST:"by8pqpsaqdwtytx20da3-mysql.services.clever-cloud.com",
    USER: "root",
    //USER:"uqp8tpqpryhnmczh",
    //PASSWORD: "javilanz1986.",
    PASSWORD:"",
    //PASSWORD:"xWFnHLgR3gKtdJ1jyw50",
    DB: "coffeeGo_db",
    //DB:"by8pqpsaqdwtytx20da3",
    dialect: "mysql",
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
};