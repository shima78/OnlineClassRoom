const express = require('express');
var  router = require('./router');
const path = require('path');
const http = require('http');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');
const {userJoin,  getCurrentUser, userLeave, getRoomUsers} = require('./utils/users');
const botName = 'admin';
const PORT = 5000
const app = express();
const jwt = require('jsonwebtoken');

app.use('/router', router);

//set static folder 
app.use(express.static(path.join(__dirname, 'public')))


//we need a server that we can access
const server = http.createServer(app)


const io = socketio(server);
//Run when a client connects

io.use(function(socket, next){
    if (socket.handshake.query && socket.handshake.query.token){
      jwt.verify(socket.handshake.query.token, 'SECRET_KEY', function(err, decoded) {
        if (err) return next(new Error('Authentication error'));
        socket.decoded = decoded;
        console.log(socket.decoded);
        next();
      });
    }
    else {
      next(new Error('Authentication error'));
    }    
  })
  .on('connection',socket =>{
    socket.on('joinRoom', ({ username, room }) => {
        const user = userJoin(socket.id, username, room);
    
        socket.join(user.room);
    
        // Welcome current user
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
    })

    //listen for answers
    socket.on('chatAnswer',ans => {
        const user = getCurrentUser(socket.id)
        //show this naswer to everone
        io.to(user.room).emit('answer',formatMessage(user.username,ans));
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
    })

})









// app.post('/api/posts', verifyToken, (req, res) => {  
//   jwt.verify(req.token, 'secretkey', (err, authData) => {
//     if(err) {
//       res.sendStatus(403);
//     } else {
//       res.json({
//         message: 'Post created...',
//         authData
//       });
//     }
//   });
// });


// FORMAT OF TOKEN
// Authorization: Bearer <access_token>

// // Verify Token
// function verifyToken(req, res, next) {
//   // Get auth header value
//   const bearerHeader = req.headers['authorization'];
//   // Check if bearer is undefined
//   if(typeof bearerHeader !== 'undefined') {
//     // Split at the space
//     const bearer = bearerHeader.split(' ');
//     // Get token from array
//     const bearerToken = bearer[1];
//     // Set the token
//     req.token = bearerToken;
//     // Next middleware
//     next();
//   } else {
//     // Forbidden
//     res.sendStatus(403);
//   } 

// }
server.listen(PORT, ()=>{console.log(`server running on port  ${PORT}`)});
