
const moment = require('moment');

const answers = [];
function formatAnswers(username, text,room){
    ans = {
        room,
        username,
        text,
        time: moment().format('h:mm a'),
        score:null,
        isAccepted : null,
        difficulty:null,
        id = null

    };
    answers.push(ans);
    return ans;
}
function getAnswer(id){
    return answers.find(ans => ans.id === id);
}
function setScore(id,score){
    a = getAnswer(id);
    a.score = score;
}
function accept(id,isAcc){
    a = getAnswer(id);
    a.isAccepted =isAcc ;
}

function setDifficulty(id,diff){
    a = getAnswer(id);
    a.diff=diff ;
}



function getRoomAnswers(room){
    
    return answers.filter(answer=> answer.room === room);
}

module.exports = {formatAnswers,
    getAnswer,
    getRoomAnswers,
    setDifficulty,
    setScore,
    accept
};