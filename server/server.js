// const path = require('path');
const http = require('http');
const  _ = require('lodash');
const socketio = require('socket.io');
const { formatMessage, getRoomMessages} = require('./utils/messages');
const {userJoin,  getCurrentUser, userLeave, getRoomUsers} = require('./utils/users');
const {formatQuestions,accept,formatAnswers,setScore,getQuestionAnswers,getRoomQuestions} = require('./utils/QA');
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

    console.log("connected");

    socket.on('login', async ({name, pass, room}) => {
        const result = await userDB.getUser(name,pass, room)
        console.log(result)

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

    socket.on('joinRoom', ({username,room, role,userID })  => {  //room is room ID
        if (room !== undefined){
            var user = userJoin(socket.id, username, room, role, userID);
            console.log(user);
            socket.join(user.room);
        }

        // Welcome current user   change event name
        socket.emit('message', formatMessage(botName, 'Welcome to ChatCord!',user.room));

        // Broadcast when a user connects
        socket.broadcast.to(user.room)
            .emit('message',
                formatMessage(botName, `${user.username} has joined the chat`,user.room)
            );

        io.to(user.room).emit('roomUsers',{
            room : user.room,
            users : getRoomUsers(user.room)
        })
        console.log('running join room')


    });

    //listen for chatMessage
    socket.on('chatMessage',msg => {
        const user = getCurrentUser(socket.id)
        //show this message to everone
        io.to(user.room).emit('message',formatMessage(user.username,msg, user.room));
    });



    //listen for Questions
    socket.on('chatQuestions',({text , difficulty}) => {
        const user = getCurrentUser(socket.id);
        console.log('current user', user)
        var arr  = formatQuestions(user.username, text, user.room, difficulty)
        console.log(arr)
        io.to(user.room).emit('newQuestion',arr);
    })

    //listen for answers
    socket.on('chatAnswer',({username, text, qid})=> {
        const user = getCurrentUser(socket.id);
        //show this naswer to everone
        io.to(user.room).emit('answer',formatAnswers(username, text, qid));
    })
    //listen for answers
    socket.on('getAnswers',(qid)=> {
        const user = getCurrentUser(socket.id);
        //show this naswer to everone
        io.to(user.room).emit('answer',);
    })
    //set score for answer
    socket.on('setScore',({qid,ansid,score})=> {
        const user = getCurrentUser(socket.id);
        //show this answer to everyone
        //instead of new score we can use answer!
        io.to(user.room).emit('newScore', setScore(qid,ansid,score));
    })
    //listen for answers
    //AMIR: WHAT IS accept??
    socket.on('accept',({qid,ansid,isAcc})=> {
        const user = getCurrentUser(socket.id);
        //show this answer to everyone
        io.to(user.room).emit('newAccept', accept(qid,ansid,isAcc));
    })



    socket.on('export', async () =>{
        const user = await getCurrentUser(socket.id)
        console.log(user)
        if (user) {
            const exportData = {
                questions: await getRoomQuestions(user.room),
                users: await getRoomUsers(user.room),
                messages: await getRoomMessages(user.room)
            };
            io.to(user.room).emit('exportData',exportData);
        }
    });



   // canvas
    socket.on('draw-from-client', function (data) {
        io.emit('draw-from-server', data);
    });

    socket.on('clear-the-canvas', function (data) {
        drawingHistory = [];
        io.emit('clear-the-canvas-from-server', data);
    });

    socket.on('maintain-history', function (data) {
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
    });

    socket.on('undo-canvas', function (data) {
        if (_.some(drawingHistory, {
            "id": socket.id
        })) {

            var drawingHistoryItem = _.filter(drawingHistory, function (item) {
                return item.id === socket.id;
            });


            var undoData = _.last(drawingHistoryItem[0].history)

            drawingHistoryItem[0].history.splice(-1);
            io.emit('clear-the-canvas-from-server', {});

            drawingHistory.forEach(function (item) {
                item.history.forEach(function (historyItem) {
                    io.emit('draw-from-server', historyItem.data);
                });
            });

            // if (undoData) {
            //     undoData.data.strokeStyle = "#c3c3c3";
            //     undoData.data.lineWidth = 8;
            //     io.emit('draw-from-server', undoData.data);
            // }
        }

    });


    //user Leave
    socket.on('logOut', async () => {
        const user = userLeave(socket.id);
        console.log(user)
        //to emit all the clinets in general we can use io.emit
        if (user) {
            io.to(user.room).emit('message', formatMessage(botName, `${user.username} has 
            left the chat`, user.room));

            io.to(user.room).emit('roomUsers', {
                room: user.room,
                users: await getRoomUsers(user.room)
            })
        }
    })
    socket.on('disconnect', async () =>{
        const user = userLeave(socket.id);
        console.log(user)
        //to emit all the clinets in general we can use io.emit
        if (user) {
            io.to(user.room).emit('message',formatMessage(botName,`${user.username} has 
            left the chat`, user.room));

            io.to(user.room).emit('roomUsers', {
                room: user.room,
                users: await getRoomUsers(user.room)
            })
        }
    });

})

server.listen(PORT, ()=>{console.log(`server running on port  ${PORT}`)});