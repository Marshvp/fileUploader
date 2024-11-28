const express = require('express');
const session = require("express-session")
const { PrismaSessionStore } = require('@quixo3/prisma-session-store')
const { PrismaClient } = require('@prisma/client')
const indexRouter = require('./routes/indexRoutes')
const path = require('node:path')
const passport = require("./passportConfig");
const userRouter = require('./routes/userRoutes');
const app = express()

app.use(express.urlencoded({ extended: true }))

const prisma = new PrismaClient()

app.use(session({
    secret: 'dogs',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 },
    store: new PrismaSessionStore(prisma, {
        checkPeriod: 2 * 60 * 1000,
        dbRecordIdIsSessionId: true,
    })
}))

app.use(passport.initialize())
app.use(passport.session())




app.use(express.static(path.join(__dirname, "public")))
app.set("view engine", "pug")
app.use('/', indexRouter)
app.use('/users', userRouter)

app.listen(9090, () => {
    console.log('Hello World');
})