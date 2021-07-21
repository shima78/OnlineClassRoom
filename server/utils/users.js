const moment = require('moment')
const users = [];
function userJoin(socketID,username,room, role,userID ){
    const user =  {socketID, 
        username,
        userID,
        room,
        joinTime:  moment().format('h:mm a'),
        leaveTime: '',
        role,
        online : true
     };
    users.push(user);
    return user
}
function getCurrentUser(id){
    return users.find(user => user.socketID === id);
}

function userLeave(id){
    const index = users.find(user=> user.socketID ===id);
    // const usr  = users[index]
    if (index!= -1){
        users[index].online = false
        users[index].leaveTime =  moment().format('h:mm a')
        return getRoomUsers( users[index].room);
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