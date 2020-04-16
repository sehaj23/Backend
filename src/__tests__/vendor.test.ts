import app from "../app";
import * as request from "supertest"
import { VendorI } from "../interfaces/vendor.interface";
import * as db from "../database"

beforeAll( async (done) => {
    await db.connectt()
    done()
})

describe('Vendor service test', () => {
    
    test('Vendor Post', async done => {
        const v: VendorI = {
            name: "Preet",
            password: "Preet123",
            "contact_number": "123456789",
            "email": "preetsc27@gmail.com"
        }
        const res = await request(app).post("/api/vendor").send(v)
        expect(res.body._id).toBeDefined()
        expect(res.body.name).toEqual(v.name)
        expect(res.body.contact_number).toEqual(v.contact_number)
        expect(res.body.email).toEqual(v.email)
        expect(res.body.password).not.toEqual(v.password)
        expect(res.status).toEqual(200)
        done()
    })

    test('Vendor Post Less data', async done => {
        const v = {
            name: "Preet",
        }
        const res = await request(app).post("/api/vendor").send(v)
        expect(res.status).toEqual(403)
        done()
    })

    test('Vendor Get Array', async done => {
        const v: VendorI = {
            name: "Preet",
            password: "Preet123",
            "contact_number": "123456789",
            "email": "preetsc27@gmail.com"
        }
        const res = await request(app).get("/api/vendor")
        expect(Array.isArray(res.body)).toBe(true)
        expect(res.status).toEqual(200)
        done()
    })

    test('Vendor Get Id', async done => {
        const v: VendorI = {
            name: "Preet",
            password: "Preet123",
            "contact_number": "123456789",
            "email": "preetsc276@gmail.com"
        }
        const res = await request(app).post("/api/vendor").send(v)
        expect(res.body._id).toBeDefined()
        
        const _id = res.body._id

        const res2 = await request(app).get(`/api/vendor/${_id}`)
        expect(res2.body.name).toEqual(v.name)
        expect(res2.body.contact_number).toEqual(v.contact_number)
        expect(res2.body.email).toEqual(v.email)
        done()
    })

    test('Vendor Put', async done => {
        const v: VendorI = {
            name: "Preet Ji",
            password: "Preet123",
            "contact_number": "123456789",
            "email": "preetsc272@gmail.com"
        }
        const res = await request(app).post("/api/vendor").send(v)
        expect(res.body._id).toBeDefined()
        
        const _id = res.body._id
        const v2: VendorI = v
        v2.name = "Preet YO"

        const res2 = await request(app).put(`/api/vendor/${_id}`).send(v2)
        expect(res2.body.name).toEqual(v2.name)
        expect(res2.body.contact_number).toEqual(v2.contact_number)
        expect(res2.body.email).toEqual(v2.email)
        done()
    })
    
})
afterAll(async (done) => {
    await db.disconnect()
    
    done()
})
