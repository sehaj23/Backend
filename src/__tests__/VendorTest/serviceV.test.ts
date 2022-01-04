import app from "../../app";
import * as request from "supertest"
import mongoose, * as db from "../../database"
import options from "../../service/services-removed-defauls"


const TIME = 30000
beforeAll(async (done) => {
    await db.connectt()
    done()
}, TIME)


// test('Add Services', async done => {
//     const res2 = await request(app).post("/api/zattire-services/").send(options)
//     expect(res2.status).toEqual(201)

//     done()

// },TIME)

// afterAll(async (done) => {
//     await db.disconnect();
//     done();
//   },TIME);





