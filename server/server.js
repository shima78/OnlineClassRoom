// const path = require('path');
const http = require('http');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');
const {userJoin,  getCurrentUser, userLeave, getRoomUsers} = require('./utils/users');
const botName = 'admin';
const PORT  = 3000;
let express = require("express");
const jwt = require('jsonwebtoken');
const userDB = require('./db/user');
//let multer  = require('multer');
// eslint-disable-next-line no-unused-vars
// const cors = require('cors');
const app = express();

//we need a server that we can access
const server = http.createServer(app);  


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

    socket.on('joinRoom', ({ username, room ,isCreator}) => {  //room is room ID
        const user = userJoin(socket.id, username, room, isCreator,socket.id);
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


    });

    //listen for chatMessage
    socket.on('chatMessage',msg => {
        const user = getCurrentUser(socket.id)
        //show this message to everone
        io.to(user.room).emit('message',formatMessage(user.username,msg));
    });

    //listen for answers
    socket.on('chatAnswer',ans => {
        const user = getCurrentUser(socket.id)
        //show this naswer to everone
        io.to(user.room).emit('answer',formatMessage(user.username,ans));
    });

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