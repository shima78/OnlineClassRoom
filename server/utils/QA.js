const moment = require('moment')
var idAuto = 0;
var idAutoAns = 0
var allQuestions  = [] 
function formatQuestions(username, text, room, difficulty){
    idAuto = idAuto +1
    var q = {
        room,
        username,
        difficulty,
        text,
        time:moment().format('h:mm a'),
        id: idAuto,
        answers : []
    };
    allQuestions.push(q)
    return allQuestions
}


function getquestionById(qid){
    const index = allQuestions.find(q=> q.id === qid);
    return index
}

function changDifficulty(qid,d){
    // q.difficulty = d
    const index = getquestionById(qid)
    allQuestions[index].difficulty = d
    return allQuestions
}

// const answers = [];
function formatAnswers(username, text, qid){
    idAuto += 1
    const ans = {
        username,
        text,
        time: moment().format('h:mm a'),
        score:null,
        isAccepted : null,
        id : idAutoAns,
        qid
    };
    const index = getquestionById(qid)
    allQuestions[index].answers.push(ans);
    return allQuestions;
}




function setScore(qid,ansid,score){
    const indexq = getquestionById(qid)
    const indexAns = allQuestions[indexq].answers.find( a=> a.id === ansid);
    allQuestions[indexq].answers[indexAns].score = score
    return allQuestions
}
function accept(qid,ansid,isAcc){
    const indexq = getquestionById(qid)
    const indexAns = allQuestions[indexq].answers.find( a=> a.id === ansid);
    allQuestions[indexq].answers[indexAns].isAccepted = isAcc
    return allQuestions
}


module.exports = {
    formatQuestions,
    // addAnswer,
    changDifficulty,
    formatAnswers,
    accept,
    setScore
}