const { body, validationResult} = require('express-validator')
const db = require('../prisma/queries')
const passport = require("../passportConfig")
 

exports.usersAddUser = [ 
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
        try {
            const errors = validationResult(req)
            if(!errors.isEmpty()){
                return res.status(400).render('index', {
                    errors: errors.array(),
                    data: req.body
                })
            }

            const email = req.body.email
            const password = req.body.password
            const name = req.body.username

            const NewUser = await db.addNewUser(email, password, name)

            console.log("New User creation finished:", NewUser);
            res.redirect('/')
        } catch (error) {
            console.error(`Error in addUser Controller`, error)
            throw error
        }
    }
]
exports.usersLogin = [
    body("email")
        .isEmail().withMessage("Must be a valid email type")
        .bail()
        .custom(async value => {
            const user = await db.checkEmailsInUse(value)
            if (!user) {
                throw  new Error('Email or Password not recognised')
            }
        }),
    body("password")
        .isLength({ min: 6 }).withMessage('Must be a minimum of 6 characters')
        .notEmpty().withMessage('Password Required'),
        
    async (req, res, next) => {

        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).render('index', {
                errors: errors.array(),
                data: req.body
            })
        }

        passport.authenticate('local', (err, user, info) => {
            if(err) {
                console.error("Error during authentication");
                return next(err)
            }
            if(!user) {
                return res.status(401).render("logIn", {
                    errors: [{ msg: "From passport.authenticate: Email or password not recognised"}],
                    data: req.body,
                })
            }

            req.login(user, (loginErr) => {
                if(loginErr){
                    console.error("Error during login", loginErr);
                    return next(err)
                }
                return res.redirect('/');
            })
        })(req, res, next)
    }
]

exports.userLogoutGet = (req, res) => {
    req.logout((err) => {
        if(err) {
            return res.status(500).send("Error Logging out")
        }
        req.session.destroy();
        res.clearCookie("connect.sid")
        res.redirect("/")
    })
}