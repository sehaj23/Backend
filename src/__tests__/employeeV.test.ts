import app from "../app";
import * as request from "supertest"
import { EmployeeI } from "../interfaces/employee.interface";
import mongoose, * as db from "../database"
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
        const res = await request(app).post("/api/vendor/employee").send(e)
        expect(res.body._id).toBeDefined()
        empid = res.body._id
        expect(res.body.phone).toBeDefined()
        expect(res.status).toEqual(200)
        done()



    })
    test("edit employee", async done => {
        const s: EmployeeI = {
            name: "sehaj chawla",
            phone: "9711841198",
            services: ["5eaa0788df36ecbc2d2b0ed3"]

        }
        const res = await request(app).put("/api/vendor/employee/edit/" + empid).send(s)
        expect(res.body._id).toBe(empid)
        expect(res.body.name).toEqual(s.name)
        expect(res.body.phone).toEqual(s.phone)
        expect(res.status).toEqual(200)
        done()


    })
    test("delete employee", async done => {
        const res = await request(app).delete("/api/vendor/employee/delete/" + empid).send(e)
        expect(res.body._id).toBe(empid)
        expect(res.body.phone).toBeDefined()
        expect(res.status).toEqual(200)
        done()


    })




})