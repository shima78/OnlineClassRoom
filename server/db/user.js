const knex = require("./knex")

function getUser(name, pass){
    return knex('user').where({
        username: name,
        password:  pass
      }).select('*')
}

module.exports = {
    getUser
}