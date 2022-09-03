const Sequelize = require("sequelize");
const connection = new Sequelize('blog', 'root', 'sua-senha-vai-aqui', {
    host: 'localhost',
    dialect: 'mysql',
    logging: false,
    timazone: "-03:00"
})

module.exports = connection;
