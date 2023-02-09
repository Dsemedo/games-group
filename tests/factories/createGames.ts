import prisma from "config/database";

export async function createGame(title: string, consoleId: number) {
    return await prisma.game.create({
        data: {
            title: title,
            consoleId: consoleId,
        }
    });
}
