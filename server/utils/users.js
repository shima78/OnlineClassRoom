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

function checkAuthorization(user){
    if(user.role==='owner' || user.role==='presenter'){
        return true
    }
    return false
}


function userPromote(user,userToPromote){
    console.log(users,userToPromote)
    if (user.role==='owner'){
        // eslint-disable-next-line no-undef
        const index = users.findIndex(user => user.socketID === userToPromote);
        users[index].role = 'presenter'
        console.log('user to promote',users[index])
        return getRoomUsers(users[index].room)
    }
    return false
}

function userDemote(user,userToDemote){
    console.log(users,userToDemote)
    if (user.role==='owner'){
        // eslint-disable-next-line no-undef
        const index = users.findIndex(user => user.socketID === userToDemote);
        users[index].role = 'std'
        console.log('user to demote',users[index])
        return getRoomUsers(users[index].room)
    }
    return false
}


function getCurrentUser(id){

    return users.find(user => user.socketID === id);
}


function getRoomOwner(room){
    return users.find(user =>(user.room === room) &&(user.role==='owner'));
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
        console.log('room v room',users,room)
    return users.filter(user=> user.room === room);
}
module.exports = {
    userJoin,
    getCurrentUser,
    userLeave,
    getRoomUsers,
    userPromote,
    userDemote,
    checkAuthorization,
    getRoomOwner
}