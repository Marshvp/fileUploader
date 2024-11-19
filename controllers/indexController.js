const { body, validationResult} = require('express-validator')
const db = require('../prisma/queries')

exports.indexHomeGet = async (req, res) => {
    res.render('index')
}


exports.indexAddUser = [ 
    body("email")
        .custom(async value => {
            const user = await db.checkEmailsInUse(value)
            if(user) {
                throw new Error('E-mail in Use Already')
            }
        })
        .isEmail().withMessage("Must be a valid email type"),
    body("password")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters long"),
    body("confirmPassword")
        .custom((value, {req}) => {
            if(value !== req.body.password) {
                throw new Error("Passwords do not match");
            }
            return true
        }),
    body("username")
        .isLength({ min: 4 }).withMessage("Username must be at least 4 characters long")
        .matches(/^[a-zA-Z0-9_]+$/)
        .withMessage("Username can only contain letters, numbers, and underscores")
        .custom(async value => {
            const user = await db.checkUsernameInUse(value)
            if(user) {
                throw new Error("Username is already in use");
            }
        }),

    async (req, res) => {
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).render('index', {
                errors: errors.array(),
                data: req.body
            })
        }
        console.log(JSON.stringify(req.body));

    res.redirect('/')
}
 ]