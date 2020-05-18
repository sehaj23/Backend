import app from "../../app";
import * as request from "supertest"
import { VendorI } from "../../interfaces/vendor.interface";
import mongoose, * as db from "../../database"
import { DesignersI } from "../../interfaces/designer.interface";
import EventI from "../../interfaces/event.interface";
import EventDesignerI from "../../interfaces/eventDesigner.model";
import { PhotoI } from "../../interfaces/photo.interface";
import * as faker from "faker"
import { SalonI } from "../../interfaces/salon.interface";
import ServiceI, { ServiceSI } from "../../interfaces/service.interface";
import { EmployeeI } from "../../interfaces/employee.interface";

const TIME = 30000
beforeAll(async (done) => {
    await db.connectt()
    done()
}, TIME)




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

describe('Salon service test', () => {
    let vendorId
    let salonid
    let token
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



    test('Salon settings test', async done => {
        const salon = {
            name: "hello12345",
            location: "OZARK"
        }
        console.log(salonid)

        const res = await request(app).put("/api/v/salon/settings/" + salonid).send(salon)

        expect(res.body.name).toEqual(salon.name)

        expect(res.body.location).toEqual(salon.location)
        expect(res.status).toEqual(200)
        done()

    })
    test('Salon settings test', async done => {

        const service={
                services:[{
                    name:"sehaj123",
                    price:123,
                    duration:15,
                    gender:"men"
                    
                    
                },{
                    
                    name:"sehaj23",
                    price:123,
                    duration:15,
                    gender:"women"
                    
                    
                }]
        }
        const res = await request(app).put(`/api/v/salon/${salonid}/service`).send(service)
        expect(res.body).toBeDefined()
        expect(res.status).toBe(200)
        done()
    })

    test('Salon settings test', async done => {
        
        const res = await request(app).get(`/api/v/salon/${salonid}/service`)
        expect(res.body).toBeDefined()
        expect(res.status).toBe(200)
        done()


    })




})

