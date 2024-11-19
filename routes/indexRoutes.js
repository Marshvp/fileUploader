const { Router } = require('express')
const indexController = require("../controllers/indexController")
const indexRouter = Router()

indexRouter.get('/', indexController.indexHomeGet)

indexRouter.post('/addUser', indexController.indexAddUser)

indexRouter.post('/loginUser', indexController.indexLogin)

module.exports = indexRouter