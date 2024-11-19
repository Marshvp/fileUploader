const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient();

async function main() {
    const users = await prisma.user.findMany()

    for(const user of users) {
        await prisma.folder.create({
            data: {
                name: "Main",
                isDefault: true,
                userId: user.id,
            },
        });
    }
}


main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(() => {
        prisma.$disconnect();
    });