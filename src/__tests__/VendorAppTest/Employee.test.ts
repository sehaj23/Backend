import app from "../../app";
import * as request from "supertest"
import { EmployeeI } from "../../interfaces/employee.interface";
import mongoose, * as db from "../../database"
const TIME = 30000
beforeAll(async (done) => {
    await db.connectt()
    done()
}, TIME)

describe('Employee  service test', () => {
    let empid;

    const e: EmployeeI = {
        name: "sehaj",
        phone: "9711841198",
        services: ["5eaa0788df36ecbc2d2b0ed3"]

    }

    test("add employee", async done => {
        const res = await request(app).post("/api/v/employee").send(e)
        expect(res.body._id).toBeDefined()
        empid = res.body._id
        expect(res.body.phone).toBeDefined()
        expect(res.status).toEqual(200)
        done()



    })
    const s = {
        phone:"9711841198",
        otp:"1234"
    }

    test("Login employee", async done => {
        const res = await request(app).post("/api/vendorapp/employee").send(s)
        
        expect(res.body.token).toBeDefined()
        expect(res.status).toEqual(200)
        done()



    })




})