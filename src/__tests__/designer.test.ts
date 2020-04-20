import app from "../app";
import * as request from "supertest"
import { VendorI } from "../interfaces/vendor.interface";
import mongoose, * as db from "../database"
import { DesignersI } from "../interfaces/designer.interface";
import EventI from "../interfaces/event.interface";
import EventDesignerI from "../interfaces/eventDesigner.model";
import { PhotoI } from "../interfaces/photo.interface";
const TIME = 30000
beforeAll( async (done) => {
    await db.connectt()
    done()
}, TIME)

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
    }, TIME)
    
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
    }, TIME)

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
    }, TIME)

    test('Check for Event in Designer', async done => {
        const res = await request(app).get(`/api/designer/${designerId}`)
        expect(res.status).toEqual(200)
        expect(Array.isArray(res.body.events)).toBeTruthy()
        const event: EventI = res.body.events[0]
        expect(event.description).toEqual(e.description)
        expect(event.exhibition_house).toEqual(e.exhibition_house)
        expect(event.name).toEqual(e.name)
        done()
    }, TIME)

    test('Update Designer PUT', async done => {
        dataToSend.brand_name = "The Brand"
        expect(designerId).toBeDefined()
        const res = await request(app).put(`/api/designer/${designerId}`).send(dataToSend)
        expect(res.status).toEqual(200)
        expect(res.body.brand_name).toEqual(dataToSend.brand_name)
        expect(res.body.start_working_hours).toBeDefined()
        expect(res.body.speciality).toEqual(dataToSend.speciality)
        expect(res.body.start_price).toEqual(dataToSend.start_price)
        done()
    }, TIME)


    // this is for the photos
    const photo: PhotoI = {
        "name": "My Pic",
        "description": "Desc of pic",
        "tags": ["Cool", "Blue"],
        "url": "this is some url"
    }

    test('Designer PUT Photo', async done => {
        const res = await request(app).put(`/api/designer/${designerId}/photo`).send(photo)
        // this is same
        expect(res.status).toEqual(200)
        expect(res.body._id).toBeDefined()
        expect(res.body.brand_name).toEqual(dataToSend.brand_name)
        expect(res.body.description).toEqual(dataToSend.description)
        expect(res.body.approved).toEqual(false)

        // checking for new photos
        expect(Array.isArray(res.body.photo_ids)).toBeTruthy()
        expect(res.body.photo_ids.length).toEqual(1)
        const gotPhoto : PhotoI= res.body.photo_ids[0]
        expect(gotPhoto.description).toEqual(photo.description)
        expect(gotPhoto.name).toEqual(photo.name)
        expect(gotPhoto.approved).toEqual(false)// by default photos should not be approved
        expect(gotPhoto.tags).toEqual(photo.tags)

        done()
    }, TIME)

    test('Designer Get Photos', async done => {
        const res = await request(app).get(`/api/designer/${designerId}/photo`)
        expect(res.status).toEqual(200)
        expect(res.body._id).toBeDefined()
        expect(res.body._id).toEqual(designerId)
        expect(Array.isArray(res.body.photo_ids)).toBeTruthy()
        expect(res.body.photo_ids.length).toEqual(1)
        const gotPhoto : PhotoI= res.body.photo_ids[0]
        expect(gotPhoto.description).toEqual(photo.description)
        expect(gotPhoto.name).toEqual(photo.name)
        expect(gotPhoto.approved).toEqual(false)// by default photos should not be approved
        expect(gotPhoto.tags).toEqual(photo.tags)
        done()
    })
    
    
})
afterAll(async (done) => {
    await db.disconnect()
    done()
}, TIME)
