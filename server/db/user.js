const knex = require("./knex")

function getUser(name, pass,room){
    // return knex('user').where('username',name).where('password',pass).select('*')
    room = 1 // FIX ROOM PLEASE :D
    return knex.select('*')
    .from('user')
    .crossJoin('meetingUsers', function() {
        this.on('user.id', '=', 'meetingUsers.userID').andOn('meetingUsers.meetingID',room) 
      }).crossJoin('meeting','meeting.id','meetingUSers.meetingID')
    .where('username',name).where('password',pass);
}

module.exports = {
    getUser
}