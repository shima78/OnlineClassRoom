var express = require("express");
var router = express.Router();
const jwt = require('jsonwebtoken');
const userDB = require('./db/user'); 
var multer  = require('multer');


router.post('/login', multer().none(), async(req, res) => {    
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

module.exports = router;