import app from "../../app";
import * as request from "supertest"
import { EmployeeI } from "../../interfaces/employee.interface";
import mongoose, * as db from "../../database"
import * as faker from "faker"
import { VendorI } from "../../interfaces/vendor.interface";
import { SalonI } from "../../interfaces/salon.interface";
const TIME = 30000
beforeAll(async (done) => {
    await db.connectt()
    done()
}, TIME)

describe('Employee  service test', () => {
    let empid;
    let vendorId
    let salonid
    let token

    const e: EmployeeI = {
        name: "sehaj",
        phone: "9711841198",
        services: ["5eaa0788df36ecbc2d2b0ed3"]

    }
    beforeAll(async (done) => {
        const v: VendorI = {
            email: "sehaj@gmail.com",
            password: "sehaj23",
            name: "Sehaj",
            contact_number: "+12193860967"
        }
        const res2 = await request(app).post("/api/v/login/create").send(v)
        expect(res2.status).toEqual(200)
        vendorId = res2.body._id

        done()
    })
    beforeAll(async (done) => {
        const login = {
            password: "sehaj23",
            email: "sehaj@gmail.com"

        }
        const res2 = await request(app).post("/api/v/login/").send(login)
        expect(res2.body.token).toBeDefined()
        token = (res2.body.token)
        done()
    
    })



const getSalon:()=>SalonI =()=>{
    const email = faker.internet.email()
    const date = new Date()
    const dataToSend: SalonI = {
        "name": "zz",
        "contact_number": "1234567890",
        "description": "desc",
        "email": email,
        "end_price": 20000,
        "start_price": 10000,
        "start_working_hours": [date, null, null, null],
        "end_working_hours": [date, null, null, null],
        "location": "Chicago",
        "speciality": ["DM"],
        "vendor_id": ""
    }
    return dataToSend
}


    test('add salon ', async done => {

       
        const dataToSend = getSalon()
        const res = await request(app).post("/api/v/salon").set('authorization',"Bearer "+token).send(dataToSend)
        expect(res.body._id).toBeDefined()
        salonid = res.body._id
        expect(res.body.start_working_hours).toBeDefined()
        expect(res.body.speciality).toEqual(dataToSend.speciality)
        expect(res.body.start_price).toEqual(dataToSend.start_price)
        expect(res.status).toEqual(200)
        done()
    })



    test("add employee", async done => {
        const res = await request(app).put(`/api/v/salon/${salonid}/employee`).set('authorization',"Bearer "+token).send(e)
        expect(res.body._id).toBeDefined()
        empid = res.body._id
      
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

