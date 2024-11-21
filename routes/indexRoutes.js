const { Router } = require('express')
const indexController = require("../controllers/indexController")
const ensureAuthenticated = require('../middleware/auth')
const indexRouter = Router()

indexRouter.get('/', indexController.indexHomeGet)

indexRouter.post('/addUser', indexController.indexAddUser)

indexRouter.post('/loginUser', indexController.indexLogin)

indexRouter.get('/logout',  indexController.userLogoutGet)
module.exports = indexRouter