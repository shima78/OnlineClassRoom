const knex = require("./knex")

function getUser(name, pass){
    return knex('user').where('username',name).where('password',pass).select('*')
}

module.exports = {
    getUser
}