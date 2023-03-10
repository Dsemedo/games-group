import prisma from "../../src/config/database";
import { faker } from '@faker-js/faker';

export async function createConsole() {
    return await prisma.console.create({ data: { name: faker.random.word() } })
}
