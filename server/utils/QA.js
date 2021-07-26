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
function getExportData(room){
    const data = []
    const qArray = allQuestions.filter(q => q.room === room);
    qArray.forEach(async function (q){
        const answers = q.answers;
        await answers.forEach( function (answer) {
            const d = {
                username: answer.username,
                text: answer.text,
                time: answer.time,
                score: answer.score,
                isAccepted : answer.isAccepted,
                id : answer.id,
                question: q.text
            }
            data.push(d)
        })
    })
    return data

}

function getquestionById(qid){
    const index = allQuestions.findIndex(q=> q.id === parseInt(qid));

    return index;
}


function getQuestionAnswers(qid){
    const index = allQuestions.findIndex(q=> q.id === parseInt(qid));
    console.log('index',index)
    return allQuestions[index]['answers']
}

function  getRoomQuestions(roomId){
    return allQuestions.filter(q => q.room === roomId);
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
    idAutoAns += 1
    const ans = {
        username: username,
        text: text,
        time: moment().format('h:mm a'),
        score:null,
        isAccepted : null,
        id : idAutoAns,
        qid: qid
    };

    const index = getquestionById(parseInt(qid))
    console.log('input',{username, text, qid},'index:',index,'allQ',allQuestions)
    allQuestions[index].answers.push(ans);

    const room = allQuestions[index].room;
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
    const room = allQuestions[indexq].room;
    return allQuestions.filter(q => q.room === room);
}


module.exports = {
    formatQuestions,
    // addAnswer,
    changDifficulty,
    formatAnswers,
    accept,
    setScore,
    getQuestionAnswers,
    getRoomQuestions,
    getExportData
}