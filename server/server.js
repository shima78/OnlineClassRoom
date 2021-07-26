// const path = require('path');
const http = require('http');
const  _ = require('lodash');
const socketio = require('socket.io');
const { formatMessage, getRoomMessages} = require('./utils/messages');
const {userJoin,  getCurrentUser, userLeave, getRoomUsers} = require('./utils/users');
const {formatQuestions,accept,formatAnswers,setScore,getQuestionAnswers,getExportData,getRoomQuestions} = require('./utils/QA');
const botName = 'admin';
const PORT  = 3000;
let express = require("express");
const jwt = require('jsonwebtoken');
const userDB = require('./db/user');
// const _ = require("core-js");
//let multer  = require('multer');
// eslint-disable-next-line no-unused-vars
// const cors = require('cors');
const app = express();
//we need a server that we can access
const server = http.createServer(app);
let drawingHistory = [];

const io = socketio(server,	{cors: {origin: "*"}});
//Run when a client connects
io.on('connection',socket =>{

    //console.log("connected");

    socket.on('login', async ({name, pass, room}) => {
        const result = await userDB.getUser(name,pass, room)
       // console.log(result)

        if(result.length){
            const usr = result[0]
           console.log(usr)
            jwt.sign({usr}, 'secretkey', { expiresIn: '2h' }, (err, token) => {
                socket.emit('loginRes',token)
            });

        }
        else{
            socket.emit('loginRes',400)
        }

    })

    socket.on('joinRoom', async ({username,room, role,userID })  => {
        const user = await userJoin(socket.id, username, room, role, userID);
        //room is room ID
        if (room !== undefined){
                        // console.log(user);
            socket.join(user.room);
        }

        // Welcome current user   change event name
        socket.emit('message', await formatMessage(botName, 'Welcome to ChatCord!',user.room));

        // Broadcast when a user connects
        socket.broadcast.to(user.room)
            .emit('message',
                await formatMessage(botName, `${user.username} has joined the chat`,user.room)
            );

        io.to(user.room).emit('roomUsers',{
            room : user.room,
            users :await getRoomUsers(user.room)
        })
        //console.log('running join room')
    });

    //listen for chatMessage
    socket.on('chatMessage',async  msg => {
        const user = getCurrentUser(socket.id)
        io.to(user.room).emit('message',await formatMessage(user.username,msg, user.room));
    });

    //listen for Questions
    //gets new question
    //returns array of answerQuestion
    socket.on('chatQuestions',async ({text , difficulty}) => {
        const user = await getCurrentUser(socket.id);
        //console.log('current user', user)
        var arr  = await formatQuestions(user.username, text, user.room, difficulty)
        //console.log(arr)
        io.to(user.room).emit('newQuestion',arr);
    })

    //listen for answers
    //gets std answer
    socket.on('chatAnswer',async ({username, text, qid})=> {
        const user = await getCurrentUser(socket.id);
        io.to(user.room).emit('answer',await formatAnswers(username, text, qid));
    })
    //listen for answers
    //gets all answer
    socket.on('getAnswers',async (qid)=> {
        const user = await getCurrentUser(socket.id);
        io.to(user.room).emit('answersArray',await getQuestionAnswers(qid));
    })
    //set score for answer
    socket.on('setScore',async ({qid,ansid,score})=> {
        const user = await getCurrentUser(socket.id);
        //show this answer to everyone
        //instead of new score we can use answer!
        io.to(user.room).emit('newScore', await setScore(qid,ansid,score));
    })
    //listen for answers
    //AMIR: WHAT IS accept??
    socket.on('accept', async ({qid,ansid,isAcc})=> {
        const user = await getCurrentUser(socket.id);
        //show this answer to everyone
        io.to(user.room).emit('newAccept',await accept(qid,ansid,isAcc));
    })



    socket.on('export', async () =>{
        const user = await getCurrentUser(socket.id)
        //console.log(user)
        if (user) {
            const exportData = {
                questions: await getExportData(user.room),
                users: await getRoomUsers(user.room),
                messages: await getRoomMessages(user.room)
            };
            io.to(user.room).emit('exportData',exportData);
        }
    });




    socket.on('draw-from-client', async function (data) {
        const user = getCurrentUser(socket.id)
        //console.log("client draw data",data)
        io.to(user.room).emit('draw-from-server', data);
    });

    socket.on('clear-the-canvas', async function (data) {
        const user = getCurrentUser(socket.id)
        drawingHistory = [];
        io.to(user.room).emit('clear-the-canvas-from-server', data);
    });

    socket.on('maintain-history', function (data) {
        //console.log('maintain-data-in:',data)
        if (!_.some(drawingHistory, {
            "id": socket.id
        })) {
            drawingHistory.push({
                id: socket.id,
                history: []
            });
        }
        var drawingHistoryItem = _.find(drawingHistory, function (item) {
            return item.id === socket.id;
        });
        drawingHistoryItem.history.push({
            data: data
        });
        //console.log('drawingHistory',drawingHistoryItem.history)

    });
        //TODO fix undo
    socket.on('undo-canvas', async function (data) {
        const user = getCurrentUser(socket.id)
        if (_.some(drawingHistory, {
            "id": socket.id
        })) {

            var drawingHistoryItem = _.filter(drawingHistory, function (item) {
                return item.id === socket.id;
            });


            var undoData = _.last(drawingHistoryItem[0].history)

            drawingHistoryItem[0].history.splice(-1);
            io.to(user.room).emit('clear-the-canvas-from-server', {});

            drawingHistory.forEach(function (item) {
                item.history.forEach(function (historyItem) {
                    if(historyItem.data.shapeProperties != false){
                        if(historyItem.data.shapeProperties =='rect'){
                            io.to(user.room).emit('rect-draw-from-server',historyItem.data)
                        }

                        else if(historyItem.data.shapeProperties =='circle'){
                            io.to(user.room).emit('circle-draw-from-server',historyItem.data)
                        }

                        else if(historyItem.data.shapeProperties == 'line'){
                            io.to(user.room).emit('line-draw-from-server',historyItem.data)
                        }
                    }
                    else{
                        io.to(user.room).emit('draw-from-server', historyItem.data);

                    }


                });
            });

            if (undoData) {
                if(!undoData.data.shapeProperties) {
                    undoData.data.strokeStyle = 'transparent';
                    undoData.data.lineWidth = data.lineWidth;
                    io.to(user.room).emit('draw-from-server', undoData.data);
                }
             }
        }

    });

    socket.on('draw-circle-client',(data) =>{
        const user = getCurrentUser(socket.id)
        console.log('drawCircle')
        io.to(user.room).emit('circle-draw-from-server',data);
    });

    socket.on('draw-rect-client',(data) =>{
        const user = getCurrentUser(socket.id)
        console.log('drawrect')
        io.to(user.room).emit('rect-draw-from-server',data);
    });

    socket.on('draw-line-client',(data) =>{
        const user = getCurrentUser(socket.id)
        console.log('drawline')
        io.to(user.room).emit('line-draw-from-server',data);
    });





    //user Leave
    socket.on('logOut', async () => {
        await userLeave(socket.id);
        const currUser = await getCurrentUser(socket.id)
        // console.log("this user left :", user)
        //to emit all the clinets in general we can use io.emit
        if (currUser) {
            io.to(currUser.room).emit('message',await formatMessage(botName,`${currUser.username} has 
            left the chat`, currUser.room));

            io.to(currUser.room).emit('roomUsers', {
                room: currUser.room,
                users: await getRoomUsers(currUser.room)
            })
        }
    })
    socket.on('disconnect', async () =>{
        await userLeave(socket.id);
        const currUser = await getCurrentUser(socket.id)
        // console.log("this user left :", user)
        //to emit all the clinets in general we can use io.emit
        if (currUser) {
            io.to(currUser.room).emit('message',await formatMessage(botName,`${currUser.username} has 
            left the chat`, currUser.room));

            io.to(currUser.room).emit('roomUsers', {
                room: currUser.room,
                users: await getRoomUsers(currUser.room)
            })
        }
    });

})

server.listen(PORT, ()=>{console.log(`server running on port  ${PORT}`)});