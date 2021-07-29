// const path = require('path');
const http = require('http');
const  _ = require('lodash');
const socketio = require('socket.io');
const { formatMessage, getRoomMessages, getChatMessages, privateMessage} = require('./utils/messages');
const {userJoin,  getCurrentUser, userLeave, getRoomUsers, userPromote,userDemote,checkAuthorization,getRoomOwner} = require('./utils/users');
const {formatQuestions,accept,formatAnswers,setScore,getQuestionAnswers,getExportData} = require('./utils/QA');
// eslint-disable-next-line no-unused-vars
const {uploadPDF, getRoomPDFList} =require('./utils/filemanager')
const botName = 'admin';
const PORT  = 3000;
let globalSocket;
let express = require("express");
const jwt = require('jsonwebtoken');
const userDB = require('./db/user');
const fs = require("fs");
const baseUrl = "http://localhost:"+ PORT +"/uploads/";
let multer  = require('multer');
const app = express();
//we need a server that we can access
const server = http.createServer(app);
global.__basedir = __dirname;

let drawingHistory = [];

const io = socketio(server,	{cors: {origin: "*"}});

//upload
const fileFilter = (req, file, cb) => {
    cb(null, true);
}
const upload = multer({
    dest: './uploads',
    fileFilter,
    limits: {
        fileSize: 500000000
    }
});

app.post('/upload', upload.single('file'), (req, res) => {

    res.json({ file: req.file });
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
    if (err.code === "INCORRECT_FILETYPE") {
        res.status(422).json({ error: 'Only images are allowed' });
        return;
    }
    if (err.code === "LIMIT_FILE_SIZE") {
        res.status(422).json({ error: 'Allow file size is 500KB' });
        return;
    }
});


//file list
app.get("/files", (req, res) => {
    // eslint-disable-next-line no-undef
    const directoryPath = __basedir + "/uploads/";

    fs.readdir(directoryPath, function (err, files) {
        if (err) {
            res.status(500).send({
                message: "Unable to scan files!",
            });
        }

        let fileInfos = [];

        files.forEach((file) => {
            fileInfos.push({
                name: file,
                url: baseUrl + file,
            });
            console.log(file)
        });

        res.status(200).send(fileInfos);
    });
});

//download
app.get("/uploads/:name", (req, res) => {
    console.log('uploade poked')
    const fileName = req.params.name;
    // eslint-disable-next-line no-undef
    const directoryPath = __basedir + "/uploads/";

    res.download(directoryPath + fileName, fileName, (err) => {
        if (err) {
            res.status(500).send({
                message: "Could not download the file. " + err,
            });
        }
    });
});

//Run when a client connects
io.on('connection',socket =>{
    globalSocket = socket
    socket.on('login', async ({name, pass, room}) => {

        const result = await userDB.getUser(name,pass, room)

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

    socket.on('loginGuest', async ({name,room}) => {
        // const result = await userDB.getUser(name,'', room)
        const roomOwner = getRoomOwner(room)
        const guestSocketId = socket.id
        io.to(roomOwner.socketID).emit('guest', {guestSocketId,name});

    })
    socket.on('acceptGuest', async ({id, name})=>{
        const user = getCurrentUser(socket.id);

        const usr = {
            socketID:id,
            username:name,
            room: user.room,
            role:'guest',
            userID:''
        }
        // console.log(usr)
        jwt.sign({usr}, 'secretkey', { expiresIn: '2h' }, (err, token) => {
            socket.emit('loginRes',token)
        });
    } )


    socket.on('joinRoom', async ({username,room, role,userID })  => {
        const user = await userJoin(socket.id, username, room, role, userID);

        //room is room ID
        if (room !== undefined){
            socket.join(user.room);
        }

        // Welcome current user   change event name
        socket.emit('message', await formatMessage(botName, 'Welcome to Flamingo!!',user.room));

        // Broadcast when a user connects
        socket.broadcast.to(user.room)
            .emit('message',
                await formatMessage(botName, `${user.username} has joined the chat`,user.room)
            );

        io.to(user.room).emit('roomUsers',{
            room : user.room,
            users :await getRoomUsers(user.room)
        })

    });
    //audio
    socket.on('radio', async (blob) =>{
        // can choose to broadcast it to whoever you want
        console.log(socket.id)
        var newData = blob.split(";");
        newData[0] = "data:audio/ogg;";
        newData = newData[0] + newData[1];
        const user = await getCurrentUser(socket.id);
        const roomBroadcast = await getRoomUsers(user.room)
        for (let i = 0; i < roomBroadcast.length; i++) {
            if(roomBroadcast[i].socketID !== socket.id){
                io.to(roomBroadcast[i].socketID).emit('voice', newData);
            }
        }


    });


    socket.on('screen', async (blob) =>{
        // can choose to broadcast it to whoever you want
        console.log(socket.id)
        var newData = blob.split(";");
        newData[0] = "data:video/ogg;";
        newData = newData[0] + newData[1];
        const user = await getCurrentUser(socket.id);
        // const roomBroadcast = await getRoomUsers(user.room)
        // for (let i = 0; i < roomBroadcast.length; i++) {
        //     if(roomBroadcast[i].socketID !== socket.id){
        //         io.to(roomBroadcast[i].socketID).emit('screenMedia', newData);
        //     }
        // }
        if(user.room!==undefined) {
            io.to(user.room).emit('screenMedia', newData);
        }
    });


    //upload image
    socket.on('fileUpload',(filename)=>{
        const user = getCurrentUser(socket.id);

        io.to(user.room).emit('bgURL',"http://localhost:"+PORT+"/uploads/"+filename);
    })

    //upload PDF
    socket.on('uploadPDF',async (filename, originalname)=>{
        const user = getCurrentUser(socket.id);
        await uploadPDF(originalname,filename,user.room,"http://localhost:"+PORT+"/uploads/"+filename)
        io.to(user.room).emit('PDF',"http://localhost:"+PORT+"/uploads/"+filename)

    })

    //get PDF list
    socket.on('getPDFList', async (room)=>{
        console.log(await getRoomPDFList(room))
        io.to(socket.id).emit('privateMessage', await getRoomPDFList(room));
        // io.to(room).emit(await getRoomPDFList(room))
    })

    //change PDF page
    socket.on('changePDFPage', async (pageNumber)=>{
        const currUser = await getCurrentUser(socket.id)
        io.to(currUser.room).emit('changePage', pageNumber)
    })


    //listen for chatMessage
    socket.on('chatMessage',async  msg => {
        const user = getCurrentUser(socket.id)
        io.to(user.room).emit('message',await formatMessage(user.username,msg, user.room));
    });
    //private message
    socket.on('sendPrivateMessage', async ({msg, receiverSocketId}) =>{
        const user = getCurrentUser(socket.id)
        const receiver = getCurrentUser(receiverSocketId)
        await privateMessage(user,receiver, msg)
        io.to(receiverSocketId).emit('newPrivateMessage',  await getChatMessages(socket.id,receiverSocketId));
        io.to(socket.id).emit('newPrivateMessage',  await getChatMessages(socket.id,receiverSocketId));
    })
    //open chat using user1, user2 socket.id
    socket.on('openChat', async (user1,user2 ) =>{
        // const user = getCurrentUser(socket.id)
        io.to(socket.id).emit('privateMessage', await getChatMessages(user1,user2));
    })



    //listen for Questions
    socket.on('chatQuestions',async ({text , difficulty}) => {
        const user = await getCurrentUser(socket.id);
        if (checkAuthorization(user)) {
            //console.log('current user', user)
            var arr = await formatQuestions(user.username, text, user.room, difficulty)
            //console.log(arr)
            io.to(user.room).emit('newQuestion', arr);
        }
    })

    //listen for answers
    socket.on('chatAnswer',async ({username, text, qid})=> {
        const user = await getCurrentUser(socket.id);
        io.to(user.room).emit('answer',await formatAnswers(username, text, qid));
    })
    //get question answers
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
    //accept or reject answers
    socket.on('accept', async ({qid,ansid,isAcc})=> {
        const user = await getCurrentUser(socket.id);
        //show this answer to everyone
        io.to(user.room).emit('newAccept',await accept(qid,ansid,isAcc));
    })

    //export users, messages, answers
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

    //whiteboard
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

    socket.on('promote',async  userToPromote => {
        const user = await getCurrentUser(socket.id)
        io.to(user.room).emit('newRole',await userPromote(user,userToPromote));
    });
    socket.on('demote',async  userToDemote => {
        const user = await getCurrentUser(socket.id)
        io.to(user.room).emit('newRole',await userDemote(user,userToDemote));
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