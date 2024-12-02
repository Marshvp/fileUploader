const { Router } = require('express')
const indexController = require("../controllers/indexController")
const { ensureAuthenticated } = require('../middleware/auth')
const indexRouter = Router()
const upload = require('../middleware/multer')

indexRouter.get('/', indexController.indexHomeGet)

indexRouter.get('/addFile',ensureAuthenticated, indexController.indexAddFileGet)

indexRouter.post('/addFile',ensureAuthenticated,upload.single("fileInput"), indexController.indexAddFilePost)


module.exports = indexRouter