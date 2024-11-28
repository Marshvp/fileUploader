const { body, validationResult} = require('express-validator')
const db = require('../prisma/queries')
const passport = require("../passportConfig")
const { upload } = require("../middleware/multer")

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

exports.indexAddFileGet = async (req, res) => {
    res.render('addFile')
}

exports.indexAddFilePost = async (req, res) => {
    try {
        if(!req.file) {
            return res.status(400).render('addFile', {
                errors: [{ message: "File is required"}],
                data: req.body
            })
        }
        console.log("Uploaded File:", req.file);
        
        return res.render('index')
    } catch (error) {
        console.error("Error processing the file");
        if (error instanceof multer.MulterError || error.message.includes("Invalid file type")) {
            return res.status(400).render("addFile", {
                errors: [{ message: error.message }],
                data: req.body,
            });
        }
        res.status(500).send("Server Error")
    }
}