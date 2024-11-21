const express = require('express');
const session = require("express-session")
const indexRouter = require('./routes/indexRoutes')
const path = require('node:path')
const passport = require("./passportConfig")
const app = express()

app.use(express.urlencoded({ extended: true }))

app.use(session({
    secret: 'dogs',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 }
}))

app.use(passport.initialize())
app.use(passport.session())




app.use(express.static(path.join(__dirname, "public")))
app.set("view engine", "pug")
app.use('/', indexRouter)

app.listen(9090, () => {
    console.log('Hello World');
})