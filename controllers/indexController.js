const { body, validationResult} = require('express-validator')
const db = require('../prisma/queries')
const passport = require("../passportConfig")

exports.indexHomeGet = async (req, res) => {
    let user
    
    if (req.user){
        console.log("Req.user:", req.user);
        
        user = req.user
    }
    res.render('index', { user: user})
}



