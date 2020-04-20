import app from "../app";
import * as request from "supertest"
import UserI from "../interfaces/user.interface";
import * as db from "../database"
beforeAll( async (done) => {
    await db.connectt()
    done()
})

describe('User service test', () => {
    
    test('User Post', async done => {
        const v: UserI = {
            name: "Preet",
            password: "Preet123",
            "email": "preetsc277@gmail.com"
        }
        const res = await request(app).post("/api/user").send(v)
        expect(res.body._id).toBeDefined()
        expect(res.body.name).toEqual(v.name)
        expect(res.body.email).toEqual(v.email)
        expect(res.body.password).not.toEqual(v.password)
        expect(res.status).toEqual(200)
        done()
    })
/*
    test('User Post Less data', async done => {
        const v = {
            name: "Preet",
        }
        const res = await request(app).post("/api/user").send(v)
        expect(res.status).toEqual(403)
        done()
    })


    test('User Get Array', async done => {
        const v: UserI = {
            name: "Preet",
            password: "Preet123",
            "email": "preet@ss.com"
        }
        const res = await request(app).get("/api/user")
        expect(Array.isArray(res.body)).toBe(true)
        expect(res.status).toEqual(200)
        done()
    })

    test('User Get Id', async done => {
        const v: UserI = {
            name: "Preet",
            password: "Preet123",
            "email": "preetsc276@gmail.com"
        }
        const res = await request(app).post("/api/user").send(v)
        expect(res.body._id).toBeDefined()
        
        const _id = res.body._id

        const res2 = await request(app).get(`/api/user/${_id}`)
        expect(res2.body.name).toEqual(v.name)
        expect(res2.body.email).toEqual(v.email)
        done()
    })

    test('User Put', async done => {
        const v: UserI = {
            name: "Preet Ji",
            password: "Preet123",
            "email": "preetsc272@gmail.com"
        }
        const res = await request(app).post("/api/user").send(v)
        expect(res.body._id).toBeDefined()
        
        const _id = res.body._id
        const v2: UserI = v
        v2.name = "Preet YO"

        const res2 = await request(app).put(`/api/user/${_id}`).send(v2)
        expect(res2.body.name).toEqual(v2.name)
        expect(res2.body.email).toEqual(v2.email)
        done()
    })
    
    */
    
})
afterAll(async (done) => {
    await db.disconnect()
    
    done()
})
