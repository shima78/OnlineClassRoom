const express = require('express');
const jwt = require('jsonwebtoken');
const userDB = require('./db/user'); 
var multer  = require('multer');
const { json } = require('body-parser');
// var upload = multer({ dest: 'uploads/' });
const app = express();


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

app.post('/api/login', multer().none(), async(req, res) => {    
    const username = req.body["username"]
    const password = req.body["password"] 

    const result = await userDB.getUser(username,password)
     
    if (result !== []){
        const usr = result[0]
        console.log(usr)
        jwt.sign({usr}, 'secretkey', { expiresIn: '30s' }, (err, token) => {
            res.json({
            // user : user,
            token : token
            });
        });
        
    }
    else{
        res.status(403)
    }


}); 

// FORMAT OF TOKEN
// Authorization: Bearer <access_token>

// Verify Token
function verifyToken(req, res, next) {
  // Get auth header value
  const bearerHeader = req.headers['authorization'];
  // Check if bearer is undefined
  if(typeof bearerHeader !== 'undefined') {
    // Split at the space
    const bearer = bearerHeader.split(' ');
    // Get token from array
    const bearerToken = bearer[1];
    // Set the token
    req.token = bearerToken;
    // Next middleware
    next();
  } else {
    // Forbidden
    res.sendStatus(403);
  } 

}

app.listen(5000, () => console.log('Server started on port 5000'));