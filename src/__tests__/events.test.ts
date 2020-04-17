import app from "../app";
import * as request from "supertest"
import { VendorI } from "../interfaces/vendor.interface";
import * as db from "../database"
import { DesignersI } from "../interfaces/designer.interface";
import EventI from "../interfaces/event.interface";
import EventDesignerI from "../interfaces/eventDesigner.model";
import { PhotoI } from "../interfaces/photo.interface";
jest.setTimeout(30000)

beforeAll( async (done) => {
    await db.connectt()
    done()
})

describe('Events service test', () => {
    
    let vendorId
    let designerId

    const date = new Date()
    const dataToSend: DesignersI = {
        "brand_name": "zz",
        "contact_number": "1234567890",
        "description": "desc",
        "designer_name": "Preet",
        "email": "emailsaa@gmail.com",
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
    let eventId
    const e: EventI = {
        name: "The great event",
        description: "Cool hai",
        entry_procedure: "$500",
        exhibition_house: "My house",
        start_date_time: "2000-07-31",
        end_date_time: "2022-02-02",
        location: "Chicago",
    }

    const photo: PhotoI = {
        "name": "My Pic",
        "description": "Desc of pic",
        "tags": ["Cool", "Blue"],
        "url": "this is some url"
    }

    beforeAll(async (done) => {
        const res = await request(app).post("/api/event").send(e)
        expect(res.body._id).toBeDefined()
        designerId = res.body._id
        expect(res.body.name).toEqual(e.name)
        expect(res.body.start_date_time).toBeDefined()
        expect(res.body.description).toEqual(e.description)
        expect(res.body.approved).toEqual(true)
        expect(res.status).toEqual(200)
        eventId = res.body._id
        done()
    })

    
    test('Events Post', async done => {
        const res = await request(app).post("/api/event").send(e)
        expect(res.body._id).toBeDefined()
        designerId = res.body._id
        expect(res.body.name).toEqual(e.name)
        expect(res.body.start_date_time).toBeDefined()
        expect(res.body.description).toEqual(e.description)
        expect(res.body.approved).toEqual(true)
        expect(res.status).toEqual(200)
        eventId = res.body._id
        done()
    })

    test('Event Get', async done => {
        const res = await request(app).get(`/api/event/${eventId}`)
        expect(res.status).toEqual(200)
        expect(res.body._id).toBeDefined()
        done()
    })

    test('Event Put', async done => {
        e.description = "This is swag"
        const res = await request(app).put(`/api/event/${eventId}`).send(e)
        expect(res.status).toEqual(200)
        expect(res.body._id).toBeDefined()
        expect(res.body.name).toEqual(e.name)
        expect(res.body.start_date_time).toBeDefined()
        expect(res.body.description).toEqual(e.description)
        expect(res.body.approved).toEqual(true)
        done()
    })

    test('Event Put Photo', async done => {
        const res = await request(app).put(`/api/event/${eventId}/photo`).send(photo)
        // this is same
        expect(res.status).toEqual(200)
        expect(res.body._id).toBeDefined()
        expect(res.body.name).toEqual(e.name)
        expect(res.body.start_date_time).toBeDefined()
        expect(res.body.description).toEqual(e.description)
        expect(res.body.approved).toEqual(true)

        // checking for new photos
        expect(Array.isArray(res.body.photo_ids)).toBeTruthy()
        expect(res.body.photo_ids.length).toEqual(1)
        const gotPhoto : PhotoI= res.body.photo_ids[0]
        expect(gotPhoto.description).toEqual(photo.description)
        expect(gotPhoto.name).toEqual(photo.name)
        expect(gotPhoto.approved).toEqual(false)// by default photos should not be approved
        expect(gotPhoto.tags).toEqual(photo.tags)

        done()
    })

    test('Event Get Photos', async done => {
        const res = await request(app).get(`/api/event/${eventId}/photo`)
        expect(res.status).toEqual(200)
        expect(res.body._id).toBeDefined()
        expect(res.body._id).toEqual(eventId)
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
})
