// const path = require('path');
const http = require('http');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');
const {userJoin,  getCurrentUser, userLeave, getRoomUsers} = require('./utils/users');
const {formatQuestions,accept,formatAnswers,setScore} = require('./utils/QA');
const botName = 'admin';
const PORT  = 3000;
let express = require("express");
const jwt = require('jsonwebtoken');
const userDB = require('./db/user');
const fs = require("fs");
const baseUrl = "http://localhost:3000/uploads/";
//let multer  = require('multer');
// eslint-disable-next-line no-unused-vars
// const cors = require('cors');
const app = express();

//we need a server that we can access
const server = http.createServer(app);
global.__basedir = __dirname

const io = socketio(server,	{cors: {origin: "*"}});
//Run when a client connects


const fileFilter = (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
    if (!allowedTypes.includes(file.mimetype)) {
        const error = new Error("Incorrect file");
        error.code = "INCORRECT_FILETYPE";
        return cb(error, false)
    }
    cb(null, true);
}

app.get("/files", (req, res) => {
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
        });

        res.status(200).send(fileInfos);
    });
});

app.get("/files/:name", (req, res) => {
    const fileName = req.params.name;
    const directoryPath = __basedir + "/uploads/";

    res.download(directoryPath + fileName, fileName, (err) => {
        if (err) {
            res.status(500).send({
                message: "Could not download the file. " + err,
            });
        }
    });
});





//upload
const upload = multer({
    dest: './uploads',
    fileFilter,
    limits: {
        fileSize: 5000000
    }
});
app.post('/upload', upload.single('file'), (req, res) => {
    res.json({ file: req.file });
});

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

    socket.on('joinRoom', ({ username, room ,isCreator})  => {  //room is room ID
        const user = userJoin(socket.id, username, room, isCreator, socket.id);
        console.log(user);
        socket.join(user.room);

        // Welcome current user   change event name
        socket.emit('message', formatMessage(botName, 'Welcome to ChatCord!'));

        // Broadcast when a user connects
        socket.broadcast.to(user.room)
            .emit('message',
                formatMessage(botName, `${user.username} has joined the chat`)
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
        io.to(user.room).emit('message',formatMessage(user.username,msg));
    });



    //listen for Questions
    socket.on('chatQuestions',({username, text, room}) => {
        const user = getCurrentUser(socket.id);
        //show this naswer to everone
        io.to(user.room).emit('newQuestion',formatQuestions(username, text, room));
    })

    //listen for answers
    socket.on('chatAnswer',({username, text, qid})=> {
        const user = getCurrentUser(socket.id);
        //show this naswer to everone
        io.to(user.room).emit('answer',formatAnswers(username, text, qid));
    })

     //set score for answer
    socket.on('setScore',({qid,ansid,score})=> {
        const user = getCurrentUser(socket.id);
        //show this answer to everone
        //instead of new score we can use answer!
        io.to(user.room).emit('newScore', setScore(qid,ansid,score));
    })
        //listen for answers
        //AMIR: WHAT IS accept??
    socket.on('accept',({qid,ansid,isAcc})=> {
    const user = getCurrentUser(socket.id);
    //show this answer to everone
    io.to(user.room).emit('newAccept', accept(qid,ansid,isAcc));
    })

    //white board
    socket.on('drawing', function(obj) {
        socket.emit('drawing', obj);
        socket.broadcast.emit('drawing', obj);
      });

      socket.on('clearAll', function(obj) {
        socket.emit('clearAll', obj);
        socket.broadcast.emit('clearAll', obj);
      });
    socket.on('upload',(filename)=>{
        const user = getCurrentUser(socket.id);
        io.to(user.room).emit('bgURL',"http://localhost:3000/uploads/"+filename);
    })

    socket.on('disconnect', () =>{
        const user = userLeave(socket.id);
        console.log(user)
        //to emit all the clinets in general we can use io.emit
        if (user) {
            io.to(user.room).emit('message',formatMessage(botName,`${user.username} has 
            left the chat`));
        }
        io.to(user.room).emit('roomUsers',{
            room : user.room,
            users : getRoomUsers(user.room)
        })
    });


})

server.listen(PORT, ()=>{console.log(`server running on port  ${PORT}`)});