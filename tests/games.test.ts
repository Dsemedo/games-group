import supertest from "supertest";
import app from "app";
import httpStatus from "http-status";
import { cleandDB } from "./factories/cleanDB";
import { createGame } from "./factories/createGames";
import { faker } from "@faker-js/faker";
import { createConsole } from "./factories/console";

const server = supertest(app);

beforeEach(async () => {
    await cleandDB();
})

describe("GET /games", () => {
    it("should respond with status 200 and an empty array when there is no games", async () => {

        const result = await server.get("/games");

        console.log(result.status)
        expect(result.status).toBe(200);
        expect(result.body).toEqual([]);
    })

    it("should respond with status 200 and an array with the game informations", async () => {
        const consoleEntity = await createConsole();
        const game = await createGame(faker.company.name(), consoleEntity.id);

        const result = await server.get("/games");


        console.log(result.body, "BODYY");

        expect(result.status).toBe(httpStatus.OK);
        expect(result.body).toEqual(expect.arrayContaining([expect.objectContaining({
            id: expect.any(Number),
            title: expect.any(String),
            consoleId: expect.any(Number),
            Console: expect.objectContaining({
                id: expect.any(Number),
                name: expect.any(String),
            })
        })]));
    })
})

describe("GET /games/:id", () => {
    it("should respond with status 409 when the game with given id doesn't exist", async () => {

        const result = await server.get("/games/0");

        expect(result.status).toBe(httpStatus.NOT_FOUND);
    })

    it("should respond with status 200 and one object with game information", async () => {
        const consoleEntity = await createConsole();
        const game = await createGame(faker.company.name(), consoleEntity.id);

        const result = await server.get(`/games/${game.id}`);

        expect(result.status).toBe(httpStatus.OK);
        expect(result.body).toEqual(expect.objectContaining({
            id: expect.any(Number),
            title: expect.any(String),
            consoleId: expect.any(Number),
        }));
    })
})

describe("POST /games", () => {
    it("Should respond with status 409 if body doesn't have title", async () => {
        const console = await createConsole();
        const game = await createGame("", console.id);


        const response = await server.post("/games").send({
            title: game.title,
            consoleId: console.id
        })

        expect(response.status).toBe(httpStatus.UNPROCESSABLE_ENTITY)
    })

    it("Should respond with status 409 if this title exist", async () => {
        const console = await createConsole();
        const game = await createGame(faker.company.name(), console.id)

        const response = await server.post("/games").send({
            title: game.title,
            consoleId: console.id
        })

        expect(response.status).toBe(httpStatus.CONFLICT)
    })


    it("Should respond with status 200 if body is valid and game was created", async () => {
        const console = await createConsole();

        const body = {
            title: faker.company.name(),
            consoleId: console.id
        }

        const response = await server.post("/games").send(body)

        expect(response.status).toBe(httpStatus.CREATED)
    })
})