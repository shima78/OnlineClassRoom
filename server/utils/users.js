
const moment = require('moment')

const users = [];
function userJoin(id,username,room){
    const user =  {id, username,room, time:  moment().format('h:mm a') };
    users.push(user);
    return user
}
function getCurrentUser(id){
    return users.find(user => user.id === id);
}

function userLeave(id){
    const index = users.find(user=> user.id ===id);
    usr  = users[index]
    if (index!= -1){
        users.splice(index,1)[0];
        return usr;
    }

}
function getRoomUsers(room){
    
    return users.filter(user=> user.room === room);
}
module.exports = {
    userJoin,
    getCurrentUser,
    userLeave,
    getRoomUsers
}