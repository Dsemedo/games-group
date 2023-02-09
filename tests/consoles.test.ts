import app from "../src/app";
import supertest from "supertest";
import { faker } from '@faker-js/faker';
import httpStatus from "http-status";
import { createConsole } from "./factories/console"
import { cleandDB } from "./factories/cleanDB";

const server = supertest(app);

beforeAll(async () => {
    await cleandDB();
})

beforeEach(async () => {
    await cleandDB();
})

describe("GET /consoles", () => {

    it("should respond with status 200 and an array of consoles", async () => {
        await createConsole();

        const result = await server.get("/consoles");

        expect(result.status).toBe(httpStatus.OK);
        expect(result.body).toEqual([
            {
                id: expect.any(Number),
                name: expect.any(String)
            }
        ])
    });

})

describe("GET /consoles/:id", () => {

    it("should respond with status 404 if are no console with this id", async () => {

        const result = await server.get(`/consoles/${faker.random.numeric(12)}`)

        expect(result.status).toBe(httpStatus.NOT_FOUND);
    })

    it("should respond with status 200 and specific console", async () => {
        const console = await createConsole();

        const result = await server.get(`/consoles/${console.id}`)

        expect(result.body).toEqual({
            id: expect.any(Number),
            name: expect.any(String),
        })
    })

})

describe("Post /consoles", () => {
    const generateValidBody = () => ({
        name: faker.name.fullName()
    });

    it("should respond with status 400 if body is invalid", async () => {
        const response = await server.post("/consoles").send({})

        expect(response.status).toBe(httpStatus.UNPROCESSABLE_ENTITY);
    })

    it("should respond with status 409 if console is already registered", async () => {
        const console = await createConsole();

        const response = await server.post("/consoles").send({ name: console.name })
        expect(response.status).toBe(httpStatus.CONFLICT);
    })

    it("should respond with status 201 and console data", async () => {
        const body = generateValidBody()
        const response = await server.post("/consoles").send(body)
        expect(response.status).toBe(httpStatus.CREATED)
    })
})