let express = require("express");
let router = express.Router();
const jwt = require('jsonwebtoken');
const userDB = require('./db/user'); 
let multer  = require('multer');
// eslint-disable-next-line no-unused-vars
const cors = require('cors');



router.post('/login' ,multer().none(), async(req, res) => {
    const username = req.body["username"] 
    const password = req.body["password"] 

    const result = await userDB.getUser(username,password)
    console.log("result:\t" + result + "\nlen:\t" + result.length);
    if(result.length){
        const usr = result[0]
        console.log(usr)
        jwt.sign({usr}, 'secretkey', { expiresIn: '2h' }, (err, token) => {
            res.json({
            // user : user,
            token : token
            });
        });
        
    }
    else{
        res.status(400).send({
            message: 'This is an error!'
         });

    }


}); 

module.exports = router;