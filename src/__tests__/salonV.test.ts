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



   
const getSalon: (vendorId: string) => SalonI = (vendorId: string) => {
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

    describe('Salon service test', () => {
        let vendorId
        let salonid
        beforeAll(async (done) => {
            const v: VendorI = {
                name: "Sehajchawla",
                password: "sehaj23",
                "contact_number": "+12193860967",
                "email": "sehajchawla233@gmail.com"
            }
            const res = await request(app).post("api/vendor/login/create").send(v)
            expect(res.body._id).toBeDefined()
            vendorId = res.body._id
    
            done()
        })

        test('add salon ', async done => {
           
        expect(vendorId).toBeDefined()
        const dataToSend = getSalon(vendorId)
        const res = await request(app).post("/api/vendor/salon").send(dataToSend)
        expect(res.body._id).toBeDefined()
        salonid = res.body._id
        expect(res.body.start_working_hours).toBeDefined()
        expect(res.body.speciality).toEqual(dataToSend.speciality)
        expect(res.body.start_price).toEqual(dataToSend.start_price)
        expect(res.status).toEqual(200)
        done()
    })

    

    test('Salon settings test', async done => {
        const salon={
            name:"hello12345",
            location:"OZARK"
        }
        console.log(salonid)
       
        const res = await request(app).put("/api/vendor/salon/settings/"+salonid).send(salon)
       
        expect(res.body.name).toEqual(salon.name)
    
        expect(res.body.location).toEqual(salon.location)
        expect(res.status).toEqual(200)
        done()
    
    
    
    })


})


