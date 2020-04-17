import app from "../app";
import * as request from "supertest"
import { VendorI } from "../interfaces/vendor.interface";
import mongoose, * as db from "../database"
import { DesignersI } from "../interfaces/designer.interface";
import EventI from "../interfaces/event.interface";
import EventDesignerI from "../interfaces/eventDesigner.model";
jest.setTimeout(30000)

beforeAll( async (done) => {
    await db.connectt()
    done()
})

describe('Designer service test', () => {
    
    let vendorId
    let designerId

    const date = new Date()
    const dataToSend: DesignersI = {
        "brand_name": "zz",
        "contact_number": "1234567890",
        "description": "desc",
        "designer_name": "Preet",
        "email": "email@gmail.com",
        "end_price": 20000,
        "start_price": 10000,
        "start_working_hours":[date, null, null, null],
        "end_working_hours": [date, null, null, null],
        "location": "Chicago",
        "speciality": ["DM"],
        "outfit_types": ["Cool otfits"],
        "vendor_id": vendorId
    }

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

    beforeAll(async (done) => {
        const v: VendorI = {
            name: "Preet",
            password: "Preet123",
            "contact_number": "123456789",
            "email": "preetsc27aa@gmail.com"
        }
        const res = await request(app).post("/api/vendor").send(v)
        vendorId = res.body._id
        dataToSend.vendor_id = vendorId
        done()
    })
    
    test('Designers Post', async done => {
        const res = await request(app).post("/api/designer").send(dataToSend)
        expect(res.body._id).toBeDefined()
        designerId = res.body._id
        expect(res.body.brand_name).toEqual(dataToSend.brand_name)
        expect(res.body.start_working_hours).toBeDefined()
        expect(res.body.speciality).toEqual(dataToSend.speciality)
        expect(res.body.start_price).toEqual(dataToSend.start_price)
        expect(res.status).toEqual(200)
        done()
    })

    test('Add Event to designer', async done => {
        
        const res = await request(app).post("/api/event").send(e)
        expect(res.status).toEqual(200)
        expect(res.body._id).toBeDefined()
        const event_id = res.body._id
        const data: EventDesignerI = {
            event_id,
            designer_id: designerId
        }
        const res2 = await request(app).post("/api/designer/event").send(data)
        expect(res2.status).toEqual(200)
        done()
    })

    test('Check for Event in Designer', async done => {
        const res = await request(app).get(`/api/designer/${designerId}`)
        expect(res.status).toEqual(200)
        expect(Array.isArray(res.body.events)).toBeTruthy()
        const event: EventI = res.body.events[0]
        expect(event.description).toEqual(e.description)
        expect(event.exhibition_house).toEqual(e.exhibition_house)
        expect(event.name).toEqual(e.name)
        done()
    })

    test('Update Designer PUT', async done => {
        dataToSend.brand_name = "The Brand"
        const res = await request(app).put(`/api/designer/${designerId}`).send(dataToSend)
        expect(res.status).toEqual(200)
        expect(res.body.brand_name).toEqual(dataToSend.brand_name)
        expect(res.body.start_working_hours).toBeDefined()
        expect(res.body.speciality).toEqual(dataToSend.speciality)
        expect(res.body.start_price).toEqual(dataToSend.start_price)
        done()
    })

    // test('Vendor Get Id', async done => {
    //     const v: VendorI = {
    //         name: "Preet",
    //         password: "Preet123",
    //         "contact_number": "123456789",
    //         "email": "preetsc276@gmail.com"
    //     }
    //     const res = await request(app).post("/api/vendor").send(v)
    //     expect(res.body._id).toBeDefined()
        
    //     const _id = res.body._id

    //     const res2 = await request(app).get(`/api/vendor/${_id}`)
    //     expect(res2.body.name).toEqual(v.name)
    //     expect(res2.body.contact_number).toEqual(v.contact_number)
    //     expect(res2.body.email).toEqual(v.email)
    //     done()
    // })

    // test('Vendor Put', async done => {
    //     const v: VendorI = {
    //         name: "Preet Ji",
    //         password: "Preet123",
    //         "contact_number": "123456789",
    //         "email": "preetsc272@gmail.com"
    //     }
    //     const res = await request(app).post("/api/vendor").send(v)
    //     expect(res.body._id).toBeDefined()
        
    //     const _id = res.body._id
    //     const v2: VendorI = v
    //     v2.name = "Preet YO"

    //     const res2 = await request(app).put(`/api/vendor/${_id}`).send(v2)
    //     expect(res2.body.name).toEqual(v2.name)
    //     expect(res2.body.contact_number).toEqual(v2.contact_number)
    //     expect(res2.body.email).toEqual(v2.email)
    //     done()
    // })
    
})
afterAll(async (done) => {
    await db.disconnect()
    
    done()
})
