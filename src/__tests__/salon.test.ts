import app from "../app";
import * as request from "supertest"
import { VendorI } from "../interfaces/vendor.interface";
import mongoose, * as db from "../database"
import { DesignersI } from "../interfaces/designer.interface";
import EventI from "../interfaces/event.interface";
import EventDesignerI from "../interfaces/eventDesigner.model";
import { PhotoI } from "../interfaces/photo.interface";
import * as faker from "faker"
import { SalonI } from "../interfaces/salon.interface";
import ServiceI, { ServiceSI } from "../interfaces/service.interface";
import { EmployeeI } from "../interfaces/employee.interface";

const TIME = 30000
beforeAll( async (done) => {
    await db.connectt()
    done()
}, TIME)

export const getSalon: (vendorId: string) => SalonI = (vendorId: string) => {
    const email = faker.internet.email()
    const date = new Date()
    const dataToSend: SalonI = {
        "name": "zz",
        "contact_number": "1234567890",
        "description": "desc",
        "email": email,
        "end_price": 20000,
        "start_price": 10000,
        "start_working_hours":[date, null, null, null],
        "end_working_hours": [date, null, null, null],
        "location": "Chicago",
        "speciality": ["DM"],
        "vendor_id": vendorId
    }
    return dataToSend
}

const getEvent: () => EventI = () => {
    const date1 = new Date()
    const e: EventI = {
        "description": "Evend des",
        "end_date_time": date1,
        "entry_procedure": "Get money",
        "exhibition_house": "My house",
        "location": "Chicago",
        "name": "Cool Event",
        "start_date_time": date1,
    }
    return e
}

describe('Salon service test', () => {
    
    let vendorId


    beforeAll(async (done) => {
        const v: VendorI = {
            name: "Preet",
            password: "Preet123",
            "contact_number": "123456789",
            "email": "preetsc27sasaaa@gmail.com"
        }
        const res = await request(app).post("/api/vendor").send(v)
        expect(res.body._id).toBeDefined()
        vendorId = res.body._id

        done()
    }, TIME)
    
    test('Salon Service Add Check', async done => {
        expect(vendorId).toBeDefined()
        const dataToSend = getSalon(vendorId)
        const res = await request(app).post("/api/salon").send(dataToSend)
        expect(res.body._id).toBeDefined()
        expect(res.body.start_working_hours).toBeDefined()
        expect(res.body.speciality).toEqual(dataToSend.speciality)
        expect(res.body.start_price).toEqual(dataToSend.start_price)
        expect(res.status).toEqual(200)

        const sid = res.body._id

        const  service: ServiceI ={
            "name": "Haircut",
            "price": 230,
            "duration": 15
        }

        const res2 = await request(app).put(`/api/salon/${sid}/service`).send(service)
        expect(res2.status).toEqual(200)
        expect(res2.body.services.length).toBeGreaterThan(0)
        const s: ServiceSI =  res2.body.services[0]
        expect(s.name).toEqual(service.name)
        const e: EmployeeI = {
            "name": "Poppeye",
            "phone": "12345678",
            "services": [s._id]
        }
        const res3 = await request(app).put(`/api/salon/${sid}/employee`).send(e)
        expect(res3.status).toEqual(200)

        done()
    }, TIME)

    test('Salon Service Get Check', async done => {
        expect(vendorId).toBeDefined()
        const dataToSend = getSalon(vendorId)
        const res = await request(app).post("/api/salon").send(dataToSend)
        expect(res.body._id).toBeDefined()
        expect(res.body.start_working_hours).toBeDefined()
        expect(res.body.speciality).toEqual(dataToSend.speciality)
        expect(res.body.start_price).toEqual(dataToSend.start_price)
        expect(res.status).toEqual(200)

        const sid = res.body._id

        const  service: ServiceI ={
            "name": "Beard Cut",
            "price": 2400,
            salon_id: sid,
            "duration": 15
        }

        const res2 = await request(app).put(`/api/salon/${sid}/service`).send(service)
        expect(res2.status).toEqual(200)
        expect(res2.body.services.length).toBeGreaterThan(0)
        
        const res3 = await request(app).get(`/api/salon/${sid}/service`)
        expect(res3.status).toEqual(200)
        expect(res3.body.length).toBeGreaterThan(0)
        const s: ServiceSI[] = res3.body
        const gotService = s[0]
        expect(gotService._id).toBeDefined()
        expect(gotService.name).toEqual(service.name)
        expect(gotService.price).toEqual(service.price)

        done()
    }, TIME)

    
    
})

// afterAll(async (done) => {
//     await db.disconnect()
//     done()
// }, TIME)
