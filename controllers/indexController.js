const { body, validationResult} = require('express-validator')
const db = require('../prisma/queries')
const passport = require("../passportConfig")

exports.indexHomeGet = async (req, res) => {
    let user
    try {
        if (req.user){
            console.log("Req.user:", req.user);
            
            user = req.user
            console.log("userid", user.id);
            
            const { rootFolder, subFolders, filesInRootFolder } = await db.indexFoldersGet(user.id)
            console.log("RootFolder", rootFolder);
            res.render('index', { user: user, rootFolder: rootFolder, subFolders: subFolders, files: filesInRootFolder})
        }
        else {
            res.render('index', { user: user})
            
        }
    } catch (error) {
        console.error("Error loading indexHomeGet:", error)   
    }
}



