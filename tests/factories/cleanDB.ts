import prisma from "config/database";

export async function cleandDB() {
    await prisma.game.deleteMany({});
    await prisma.console.deleteMany({});
   
}


