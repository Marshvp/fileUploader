
exports.ensureAuthenticated = (req, res, next) => {
    if(req.isAuthenticated()){
        console.log("EnsureAuth hit and is Auth");
        
        res.locals.user = req.user
        return next();
    }
    res.redirect('/users')
}