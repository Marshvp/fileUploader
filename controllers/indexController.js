const { body, validationResult} = require('express-validator')
const db = require('../prisma/queries')
const passport = require("../passportConfig")
const path = require("node:path")

exports.indexHomeGet = async (req, res) => {
    let user
    try {
        if (req.user){
            user = req.user
            const { rootFolder, subFolders, filesInRootFolder } = await db.indexFoldersGet(user.id)
            console.log("RootFolder", rootFolder);
            console.log("subFolders", subFolders);
            if(subFolders) {
                console.log(true);
                
            }
            
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


exports.indexAddFilePost = async (req, res, next) => {
    try {
        if(!req.file) {
            return res.status(400).render("addFile", {
                errors: [{ message: "File Upload failed, please try again"}],
            });
        }

        console.log("indexAddFilePost log: req.body.folderName", req.body.folderName);
        
        await db.addFile(req.body.folderName, req.user.id, req.file)
        console.log("File Saved");
        res.redirect('/')
        
    } catch (error) {
        console.error("Error adding in controller")
        res.status(500).send("Server Error")
    }
}