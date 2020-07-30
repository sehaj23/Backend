import app from "../../app";
import * as request from "supertest"
import { EmployeeI } from "../../interfaces/employee.interface";
import mongoose, * as db from "../../database"
import { VendorI } from "../../interfaces/vendor.interface";
import User from "../../models/user.model";
import * as faker from "faker"
import { SalonI } from "../../interfaces/salon.interface";
const TIME = 30000
beforeAll(async (done) => {
    await db.connectt()
    done()
}, TIME)

describe('Employee  service test', () => {
    let empid;
    let token
    let vendorId
    let salonid
    let serviceId
    let userid

  

    beforeAll(async (done) => {
        const v: VendorI = {
            name: "Sehajchawla",
            password: "sehaj23",
            "contact_number": "+12193860967",
            email: "sehajchawla233@gmail.com"
        }
        const Vendoreres = await request(app).post("/api/v/login/create").send(v)

        const login = {
            password: "sehaj23",
            email: "sehajchawla233@gmail.com"

        }
        const res2 = await request(app).post("/api/v/login/").send(login)
        expect(res2.body.token).toBeDefined()
        token = (res2.body.token)
        console.log(token)
        

        vendorId = Vendoreres.body._id

        const us = {
            name: "sehaj",
            email: "sehakasndna@gmail.com",
            password: "sehaj233"


        }
        const Useres = await User.create(us)
        userid = Useres._id

     

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
            "vendor_id": vendorId,
            "services":[{
                name: "sehaj",
                price: 200,
                category:"check123",
                duration: 15,
                gender:"men"
            }]
        }
        const salonres = await request(app).post("/api/v/salon").set('authorization',"Bearer "+token).send(dataToSend)
        salonid = salonres.body._id
        serviceId = salonres.body.services[0]._id
        console.log("salone id", salonid)
        console.log("userid", userid)
        console.log("service", serviceId)
        done()
    })
    const e: EmployeeI = {
        name: "sehaj",
        phone: "9711841198",
        services: ["5eaa0788df36ecbc2d2b0ed3"],
        location:"Both"

    }
    test("add employee", async done => {
        const res = await request(app).put(`/api/v/salon/${salonid}/employee`).set('authorization',"Bearer "+token).send(e)
        expect(res.body._id).toBeDefined()
        console.log(res.body)
        empid = res.body._id
        expect(res.body.employees[0].phone).toEqual(e.phone)
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