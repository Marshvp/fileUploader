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
                return { success: true, userId: user.id}
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