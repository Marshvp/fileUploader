const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient();

exports.addNewUser = async (email, password, name) => {
    try {
        console.log("Queries hit - addNewUser")
        const hashedPassword = await bcrypt.hash(password, 10)
        
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
                updatedAt: new Date(),
            }
        })
        
        await createMainFolder(user)

        console.log("User created:", user);
        return user
    } catch (error) {
        console.log("Error adding new user to the DB", error)
        throw error
    }
}

async function createMainFolder(user) {
    try {
        console.log("Queries hit - createMainFolder")
        const mainFolder = await prisma.folder.create({
            data: {
                name: "Main",
                isDefault: true,
                userId: user.id
            }
        })
        console.log(`Main Folder created for ${user.name}:`, mainFolder)
        return mainFolder
    } catch (error) {
        console.error(`Error creating new Main folder for ${user.name}:`, error)
        throw error
    }
}



exports.checkEmailsInUse = async (email) => {
    try {
        console.log("Queries hit - CheckEmailsInUse");
        const user = await prisma.user.findUnique({
            where: { email }
        })
        console.log("user:", user);
        return user
    } catch (error) {
        console.error("Error checking emails in DB", error)
        throw error
    }
}

exports.checkUsernameInUse = async (name) => {
    try {
        console.log("Queries hit - CheckUsernameInUse");
        const user = await prisma.user.findUnique({
            where: { name },
        })
        console.log("user:", user);
        return user
    } catch (error) {
        console.error("Error checking Username in use in db")
        throw error
    }
}

exports.loginUser = async (email, password) => {
    try {
        console.log("Queries hit - loginUser");
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if(user) {
            const hashedPasword = user.password
            const isMatch = await bcrypt.compare(password, hashedPasword)
            if(isMatch){
                console.log("User is found and password Matched", user);
                return { success: true, user:user }
            } else {
                console.error("User Found but incorrect password")
                return { success: false, message: "Incorrect Password"}
            }
        } else {
            return { success: false, message: "Incorrect Username"}
        }
    } catch (error) {
        console.error("Error logging in user in DB", error)
    }
}

exports.getUserById = async (id) => {
    try {
        const user = await prisma.user.findFirst({
            where: { id }
        })
        return user
    } catch (error) {
        console.error("Error on DB finding User By Id", error)
    }
}

exports.indexFoldersGet = async (userId) => {
    try {
        const rootFolder = await prisma.folder.findFirst({
            where: {
                userId: userId,
                name: "Main",
                parentId: null,
            },
        });
        if(!rootFolder) {
            throw new Error("Root Folder not found")
        }
        

        const subFolders = await prisma.folder.findMany({
            where: {
                userId: userId,
                parentId: rootFolder.id
            },
        })
        console.log("indexFoldersGet log: subFolder Check", subFolders);
        
        const filesInRootFolder = await prisma.file.findMany({
            //
            where: {
                userId: userId,
                folderId: rootFolder.id,
            }, 
        });
        
        const subFoldersWithFiles = await Promise.all(
            subFolders.map( async (folder) => {
                const filesInSubFolder = await prisma.file.findMany({
                    where: {
                        userId: userId,
                        folderId: folder.id
                    }
                })
                return {
                    ...folder,
                    files: filesInSubFolder,
                }
            })
            
        )

        return {
            rootFolder: rootFolder,
            filesInRootFolder: filesInRootFolder,
            subFolders: subFoldersWithFiles,
        }

    } catch (error) {
        console.error("Error getting all index folders in db", error)
        throw error
    }
}


exports.addFile = async (folderName, userId, file) => {

    console.log("addFile log: folderName, userId, file", folderName, userId, file);
    
    try {
        let folder = await prisma.folder.findFirst({
            where: {
                name: folderName ,
                userId: userId
            },
        });

        if(!folder) {
            folder = await prisma.folder.findFirst({
                where: {
                    name: "main",
                    userId: userId,
                },
            });
        };

        console.log("Database folder check", folder);
        
        const uploadedFile = await prisma.file.create({
            data: {
                fileName: file.originalname, // Original file name
                filePath: file.path, // File path in the filesystem
                mimetype: file.mimetype, // MIME type (e.g., image/jpeg)
                size: file.size, // File size in bytes
                userId: userId, // Link the file to the user
                folderId: folder ? folder.id : null, // Link the file to the folder
            }
        }) 
        return 
    } catch (error) {
        console.error("Error saving in the database", error)
        throw error
    }
}

exports.createFolder = async (folderName, userId) => {
    try {
        let findParent = await prisma.folder.findFirst({
            where: {
                name: "Main",
                userId: userId
            }
        });
        let folder = await prisma.folder.create({
            data: {
                name: folderName,
                userId: userId,
                isDefault: false,
                parentId: findParent.id     
            },
        });

        return folder
    } catch (error) {
        console.error(error);
        throw error
    }
}

exports.findFolderPost = async (folderName, userId) => {
    
    try {
        let folder = await prisma.folder.findFirst({
            where: {
                name: folderName,
                userId: userId,
            },
        });
        
        return folder
    } catch (error) {
        console.error(error);
        throw error
    }
}