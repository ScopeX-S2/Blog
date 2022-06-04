const Sequelize = require("sequelize");
const connection = new Sequelize('blog', 'root', '44334455', {
    host: 'localhost',
    dialect: 'mysql',
    logging: false,
    timazone: "-03:00"
})

module.exports = connection;