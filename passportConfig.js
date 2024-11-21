const passportConfig = require('passport')
const LocalStrategy = require('passport-local')
const db = require('./prisma/queries')


passportConfig.serializeUser((user, done) => {
    // console.log("SerializeUser:", user);
    done(null, user.id);
});

passportConfig.deserializeUser(async (id, done) => {
    try {
        const user = await db.getUserById(id);
        done(null, user)
    } catch (error) {
        done(error, null)
    }
})

passportConfig.use(
    new LocalStrategy(
        {
            usernameField: "email",
            passwordField: "password",
        },
        async (email, password, done) => {
            try {
                console.log("localStrat hit");
                
                const user = await db.loginUser(email, password);
                if(user.success) {
                    return done(null, user.user);
                }
                    return done(null, false, { message: "Invalid email address" })
            } catch (error) {
                console.error("Error in local strategy");
                return done(error)
            }
        }
    )
);

module.exports = passportConfig