const express = require('express')
// var  router = require('./router')
const path = require('path')
const http = require('http')
const socketio = require('socket.io')
const formatMessage = require('./utils/messages')
const {formatQuestions,formatAnswers,accept,setScore} = require('./utils/QA')
const {userJoin,  getCurrentUser, userLeave, getRoomUsers} = require('./utils/users')
const botName = 'admin'
const PORT = 5000
const app = express()
const cors = require('cors')
let corsOptions = {
    origin: "*",
    optionsSuccessStatus: 200
}
app.use(cors(corsOptions))
// app.use('/router', router)

//set static folder 
app.use(express.static(path.join(__dirname, 'public')))


//we need a server that we can access
const server = http.createServer(app)


const io = socketio(server,{cors: {origin: "*"}})
//Run when a client connects
 
io.on('connection',socket =>{
        
        socket.on('joinRoom', ({ username, room, role, userid }) => {
        const user = userJoin(socket.id, username, room, role,userid);
    
        socket.join(user.room);
    
        // Welcome current user
        socket.emit('message', formatMessage(botName, 'Welcome to ChatCord!'));
    
        // Broadcast when a user connects
        socket.broadcast.to(user.room).emit('message',
        formatMessage(botName, `${user.username} has joined the chat`)
          );
          
        io.to(user.room).emit('roomUsers',{
            room : user.room,
            users : getRoomUsers(user.room)
        })
    
 
      })

    //listen for chatMessage
    socket.on('chatMessage',msg => {
        const user = getCurrentUser(socket.id)
        //show this message to everone
        io.to(user.room).emit('message',formatMessage(user.username,msg));
    })

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
        //show this naswer to everone
        //instead of new score we can use answer!
        io.to(user.room).emit('newScore', setScore(qid,ansid,score));
    })
        //listen for answers
    socket.on('accept',({qid,ansid,isAcc})=> {
    const user = getCurrentUser(socket.id);
    //show this naswer to everone
    io.to(user.room).emit('newAccept', accept(qid,ansid,isAcc));
    })


    socket.on('disconnect', () =>{
        const user = userLeave(socket.id);
        console.log(user);
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


server.listen(PORT, ()=>{console.log(`server running on port  ${PORT}`)});
