import prisma from "config/database";

export async function createAGame() {
   await prisma.game.create({
        data: {
            title: "The Last Of Us",
            consoleId: 1,
        }
    })
}
