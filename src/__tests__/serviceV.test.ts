import app from "../app";
import * as request from "supertest"
import { ServiceSI } from "../interfaces/service.interface";

import mongoose, * as db from "../database"
const TIME = 30000
beforeAll(async (done) => {
    await db.connectt()
    done()
}, TIME)

describe(' service test', () => {
    let serviceid;
    //@ts-ignore
    const s: ServiceSI = {
        name: "sehaj",
        price: 200,
        duration: 15,
        salon_id: "5ea891f2514ad3a98cb459f7"

    }


    test("add service test", async done => {
        const res = await request(app).post("/api/vendor/service").send(s)
        expect(res.body._id).toBeDefined()
        serviceid = res.body._id
        expect(res.body.name).toEqual(s.name)
        expect(res.status).toBe(200)
        done()


    })

    test("get all service test", async done => {
        const res = await request(app).get("/api/vendor/service").send(s)
        expect(res.body).toBeDefined()

        expect(res.status).toBe(200)
        done()


    })
    test("edit service test", async done => {
        //@ts-ignore
        const v: ServiceSI = {
            name: "sehaj chawla",
            price: 200,
            duration: 15,
            salon_id: "5ea891f2514ad3a98cb459f7"

        }
        const res = await request(app).put("/api/vendor/service/edit/" + serviceid).send(v)
        expect(res.body.name).toEqual(v.name)
        expect(res.body.price).toEqual(v.price)
        expect(res.status).toBe(200)
        done()


    })
    test("delete service test", async done => {


        const res = await request(app).delete("/api/vendor/service/delete/" + serviceid)
        expect(res.body._id).toEqual(serviceid)

        expect(res.status).toBe(200)

        done()


    })




})
