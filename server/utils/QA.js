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
    return allQuestions.filter(q => q.room === room);
}


function getquestionById(qid){
    const index = allQuestions.find(q=> q.id === qid);
    return index
}

function changDifficulty(qid,d){
    // q.difficulty = d
    const index = getquestionById(qid)
    allQuestions[index].difficulty = d
    var room = allQuestions[index].room
    return allQuestions.filter(q => q.room === room);
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
    var room = allQuestions[index].room
    return allQuestions.filter(q => q.room === room);
}




function setScore(qid,ansid,score){
    const indexq = getquestionById(qid)
    const indexAns = allQuestions[indexq].answers.find( a=> a.id === ansid);
    allQuestions[indexq].answers[indexAns].score = score
    var room = allQuestions[indexq].room
    return allQuestions.filter(q => q.room === room);

}
function accept(qid,ansid,isAcc){
    const indexq = getquestionById(qid)
    const indexAns = allQuestions[indexq].answers.find( a=> a.id === ansid);
    allQuestions[indexq].answers[indexAns].isAccepted = isAcc
    var room = allQuestions[indexq].room
    return allQuestions.filter(q => q.room === room);
}


module.exports = {
    formatQuestions,
    // addAnswer,
    changDifficulty,
    formatAnswers,
    accept,
    setScore
}