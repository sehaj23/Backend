import app from "../../app";
import * as request from "supertest"
import { VendorI } from "../../interfaces/vendor.interface";
import * as db from "../../database"
beforeAll(async (done) => {
    await db.connectt()
    done()
})
const TIME = 30000

describe('Vendor service test', () => {

    test('Vendor create', async done => {
        const v: VendorI = {
            email: "sehaj@gmail.com",
            password: "sehaj23",
            name: "Sehaj",
            contact_number: "12193860967"
        }
        const res = await request(app).post("/api/v/login/create").send(v)
        expect(res.status).toEqual(201)
        // v.email = "Preet@gmail.com"
        // const res = await request(app).post("/api/vendor/login").send(v)
        // expect(res.status).toEqual(403)
        done()
    },TIME)

    test("Vendor login",async done =>{
        const d = {
            email: "sehaj@gmail.com",
            password: "sehaj23"
            
        }
        const res2 = await request(app).post("/api/v/login/").send(d)
        expect(res2.status).toEqual(200)
        expect(res2.body.token).toBeDefined()
        done()

    },TIME)

    afterAll(async (done) => {
        await db.disconnect();
        done();
      });
})




