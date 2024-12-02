const multer = require("multer");
const path = require("node:path");
const db = require('../prisma/queries')
const fs = require("node:fs")

const storage = multer.diskStorage({
    destination: async (req, file, cb) => {
        
        if(!req.folderPath) {
            
            try{
                const userDir = `uploads/${req.user.name}-${req.user.id}/main`;
                let folderPath = userDir
                if(req.body.folderName) {
                    console.log(req.body.folderName);
                    
                    
                    let folder = await db.findFolderPost(req.body.folderName, req.user.id)
                    if(!folder) {
                        folder = await db.createFolder(req.body.folderName, req.user.id)
                    }
                    folderPath = path.join(userDir, folder.name)

                };
                if(!fs.existsSync(folderPath)){
                    fs.mkdirSync(folderPath, { recursive: true });
                }
                req.folderPath = folderPath;

            } catch(error) {
                return cb(new Error("Folder path not set"))
            }
        }

        cb(null, req.folderPath)
    },
    filename: (req, file, cb) => {
        const timestamp = Date.now();
        const ext = path.extname(file.originalname);
        const baseName = path.basename(file.originalname, ext)
        cb(null, `${baseName}-${timestamp}${ext}`)
    }
});


const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        const allowedTypes = [
        "image/jpeg",
        "image/png",
        "application/msword",
        "text/plain",
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/xml",
    ];

    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error("Invalid file type. Only specific file types are allowed."));
    }

    cb(null, true); // Accept the file
  },
});

module.exports = upload;