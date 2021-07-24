const moment = require('moment')
let all = []
function formatMessages(username, text, room){
    const msg =    {
        room,
        username,
        text,
        time:moment().format('h:mm a')
    };
    all.push(msg)
    return msg

}

function getRoomMessages(roomId){

    return all.filter(message=> message.room === roomId);
}


module.exports = {
    formatMessages,
    getRoomMessages
};