const express = require('express');
const expressSession = require('express-session')
const indexRouter = require('./routes/indexRoutes')
const path = require('node:path')
const app = express()

app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, "public")))
app.set("view engine", "pug")
app.use('/', indexRouter)

app.listen(9090, () => {
    console.log('Hello World');
})