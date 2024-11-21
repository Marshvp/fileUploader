const { Router } = require('express')
const indexController = require("../controllers/indexController")
const ensureAuthenticated = require('../middleware/auth')
const indexRouter = Router()

indexRouter.get('/', indexController.indexHomeGet)

module.exports = indexRouter