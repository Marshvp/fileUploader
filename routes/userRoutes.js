const { Router } = require('express')

const userController = require('../controllers/usersController')

const userRouter = Router()

userRouter.get('/', (req, res) => {
    return res.render('logIn')
})

userRouter.get('/signUp', (req, res) => {
    return res.render('signUp')
})

userRouter.post('/addUser', userController.usersAddUser)

userRouter.post('/loginUser', userController.usersLogin)

userRouter.get('/logout',  userController.userLogoutGet)

module.exports = userRouter