const Sequelize = require('sequelize')
const connection = require("../database/database")

const User = connection.define('user', {
    user: {
        type: Sequelize.STRING,
        allowNull: false
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    },
    useradm: {
        type: Sequelize.INTEGER,
        allowNull: false
    }
})

//User.sync({force: false}).then(console.log("Tabela Criada com sucesso!"))

module.exports = User;