const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient();

exports.addNewUser = async (email, password, name) => {

}

exports.checkEmailsInUse = async (email) => {
    try {
        console.log("hit");
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
        console.log("hit username check");
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

