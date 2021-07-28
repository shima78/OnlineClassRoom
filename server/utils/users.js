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

function userPromote(user,userToPromote){
    if (user.role==='owner'){
        const index = users.findIndex(user => user.socketID === id);
        users[index].role = 'presenter'
        return getRoomUsers(userToPromote.room)
    }
    return false
}


function getCurrentUser(id){
    return users.find(user => user.socketID === id);
}

function userLeave(id){
    var  usr = users.find(user=> user.socketID ===id);
    if (usr!== undefined){
        // console.log(users[index])
        console.log(usr["username"],"has left")
        usr["online"] = false
        usr["leaveTime"] =  moment().format('h:mm a')
        return getRoomUsers( usr["room"]);
    }

}
function getRoomUsers(room){

    return users.filter(user=> user.room === room);
}
module.exports = {
    userJoin,
    getCurrentUser,
    userLeave,
    getRoomUsers,
    userPromote
}