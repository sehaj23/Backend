import app from "../../app";
import * as request from "supertest"
import UserI from "../../interfaces/user.interface";
import * as db from "../../database"
beforeAll(async (done) => {
    await db.connectt()
    done()
})
const TIME = 30000

describe('User Login/Signup test', () => {

    test('User-Signup', async done => {
        const user: UserI = {
            name: "amant",
            email: "amant@gmail.com",
            password: "abc@123",
        }
        const res = await request(app).post("/api/u/login/create").send(user)
        expect(res.status).toEqual(201)
        done()
    }, TIME)

    test("User-Login", async done => {
        const user = {
            email: "amant@gmail.com",
            password: "abc@123"
        }
        const res = await request(app).post("/api/u/login/").send(user)
        expect(res.status).toEqual(200)
        expect(res.body.token).toBeDefined()
        done()
    }, TIME)
    
})