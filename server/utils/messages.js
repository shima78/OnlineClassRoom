const moment = require('moment')
let all = []
let pvMessages = []
let pvId = 0
function formatMessage(username, text, room){
    const msg =    {
        room,
        username,
        text,
        time:moment().format('h:mm a')
    };
    all.push(msg)
    return msg

}

function privateMessage(sender, receiver,msg ){
    pvId += 1
    const pvMessage = {
        id : pvId,
        room: sender.room,
        sender,
        receiver,
        msg,
        time: moment().format('h:mm a')
    }
    pvMessages.push(pvMessage)
    return pvMessage
}

function getRoomMessages(roomId){

    return all.filter(message=> message.room === roomId);
}
function getChatMessages(user1, user2){
    const res = []
    for (let i = 0; i < pvMessages.length; i++) {
        if(user1 === pvMessages[i].sender && user2 === pvMessages[i].receiver){
            res.push(pvMessages[i])
        }
        else if(user2 === pvMessages[i].sender && user1 === pvMessages[i].receiver){
            res.push(pvMessages[i])
        }
    }
    res.sort(function(a, b) {
        return a.id - b.id  ;
    });
    return res
}

module.exports = {
    formatMessage,
    getRoomMessages,
    privateMessage,
    getChatMessages
};