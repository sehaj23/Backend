import app from "../app";
import * as request from "supertest"
import { VendorI } from "../interfaces/vendor.interface";
import mongoose, * as db from "../database"
import { DesignersI } from "../interfaces/designer.interface";
import EventI from "../interfaces/event.interface";
import EventDesignerI from "../interfaces/eventDesigner.model";
import { PhotoI } from "../interfaces/photo.interface";
import * as faker from "faker"

const TIME = 30000
beforeAll(async (done) => {
    await db.connectt()
    done()
}, TIME)

const getDesigner: (vendorId: string) => DesignersI = (vendorId: string) => {
    const email = faker.internet.email()
    const date = new Date()
    const dataToSend: DesignersI = {
        "brand_name": "zz",
        "contact_number": "1234567890",
        "description": "desc",
        "designer_name": "Preet",
        "email": email,
        "end_price": 20000,
        "start_price": 10000,
        "start_working_hours": [date, null, null, null],
        "end_working_hours": [date, null, null, null],
        "location": "Chicago",
        "speciality": ["DM"],
        "outfit_types": ["Cool otfits"],
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

describe('Designer service test', () => {

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

    test('Designers Post', async done => {
        const dataToSend = getDesigner(vendorId)
        const res = await request(app).post("/api/designer").send(dataToSend)
        expect(res.body._id).toBeDefined()
        expect(res.body.brand_name).toEqual(dataToSend.brand_name)
        expect(res.body.start_working_hours).toBeDefined()
        expect(res.body.speciality).toEqual(dataToSend.speciality)
        expect(res.body.start_price).toEqual(dataToSend.start_price)
        expect(res.status).toEqual(200)
        done()
    }, TIME)

    test('Add Event to designer', async done => {
        // add event
        const e = getEvent()
        const res = await request(app).post("/api/event").send(e)
        expect(res.status).toEqual(200)
        expect(res.body._id).toBeDefined()
        const event_id = res.body._id

        // add designer
        const dataToSend = getDesigner(vendorId)
        const resD = await request(app).post("/api/designer").send(dataToSend)
        expect(resD.body._id).toBeDefined()
        const designerId = resD.body._id

        const data: EventDesignerI = {
            event_id,
            designer_id: designerId
        }
        const res2 = await request(app).post("/api/designer/event").send(data)
        expect(res2.status).toEqual(200)
        expect(res2.body._id).toEqual(event_id)
        expect(res2.body.designers).toBeDefined()
        expect(Array.isArray(res2.body.designers)).toBeTruthy()
        expect(res2.body.designers[0]).toEqual(designerId)

        done()
    }, TIME)

    test('Check for Event in Designer', async done => {

        // add event
        const e = getEvent()
        const resE = await request(app).post("/api/event").send(e)
        expect(resE.status).toEqual(200)
        expect(resE.body._id).toBeDefined()
        const event_id = resE.body._id


        // add designer
        const dataToSend = getDesigner(vendorId)
        const resD = await request(app).post("/api/designer").send(dataToSend)
        expect(resD.body._id).toBeDefined()
        const designerId = resD.body._id

        const data: EventDesignerI = {
            event_id,
            designer_id: designerId
        }
        const res2 = await request(app).post("/api/designer/event").send(data)
        expect(res2.status).toEqual(200)

        const res = await request(app).get(`/api/designer/${designerId}`)
        expect(res.status).toEqual(200)
        expect(Array.isArray(res.body.events)).toBeTruthy()
        const event: EventI = res.body.events[0]
        expect(event.description).toEqual(e.description)
        expect(event.exhibition_house).toEqual(e.exhibition_house)
        expect(event.name).toEqual(e.name)
        done()
    }, TIME)


    /*test('Delete Event FAIL in Designer', async done => {

        // add event
        const e = getEvent()
        const resE = await request(app).post("/api/event").send(e)
        expect(resE.status).toEqual(200)
        expect(resE.body._id).toBeDefined()
        const event_id = resE.body._id


        // add designer
        const dataToSend = getDesigner(vendorId)
        const resD = await request(app).post("/api/designer").send(dataToSend)
        expect(resD.body._id).toBeDefined()
        const designerId = resD.body._id

        const data: EventDesignerI = {
            event_id,
            designer_id: designerId
        }
        const res = await request(app).get(`/api/designer/${designerId}`)
        expect(res.status).toEqual(200)
        expect(Array.isArray(res.body.events)).toBeTruthy()
        expect(res.body.events.length).toEqual(0)

        const resDelete = await request(app).delete("/api/designer/event").send(data)
        expect(resDelete.status).toEqual(403)

        done()
    }, TIME)*/

    test('Delete Event PASS in Designer', async done => {

        // add event
        const e = getEvent()
        const resE = await request(app).post("/api/event").send(e)
        expect(resE.status).toEqual(200)
        expect(resE.body._id).toBeDefined()
        const event_id = resE.body._id


        // add designer
        const dataToSend = getDesigner(vendorId)
        const resD = await request(app).post("/api/designer").send(dataToSend)
        expect(resD.body._id).toBeDefined()
        const designerId = resD.body._id

        const data: EventDesignerI = {
            event_id,
            designer_id: designerId
        }
        const res2 = await request(app).post("/api/designer/event").send(data)
        expect(res2.status).toEqual(200)

        const resDelete = await request(app).delete("/api/designer/event").send(data)
        expect(resDelete.status).toEqual(204)

        done()
    }, TIME)

    test('Update Designer PUT', async done => {
        // add designer
        const dataToSend = getDesigner(vendorId)
        const resD = await request(app).post("/api/designer").send(dataToSend)
        expect(resD.body._id).toBeDefined()
        const designerId = resD.body._id
        dataToSend.brand_name = "The Brand"
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
        // add designer
        const dataToSend = getDesigner(vendorId)
        const resD = await request(app).post("/api/designer").send(dataToSend)
        expect(resD.body._id).toBeDefined()
        const designerId = resD.body._id

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
        const gotPhoto: PhotoI = res.body.photo_ids[0]
        expect(gotPhoto.description).toEqual(photo.description)
        expect(gotPhoto.name).toEqual(photo.name)
        expect(gotPhoto.approved).toEqual(false)// by default photos should not be approved
        expect(gotPhoto.tags).toEqual(photo.tags)

        done()
    }, TIME)

    test('Designer Get Photos', async done => {
        // add designer
        const dataToSend = getDesigner(vendorId)
        const resD = await request(app).post("/api/designer").send(dataToSend)
        expect(resD.body._id).toBeDefined()
        const designerId = resD.body._id

        const resP = await request(app).put(`/api/designer/${designerId}/photo`).send(photo)
        // this is same
        expect(resP.status).toEqual(200)

        const res = await request(app).get(`/api/designer/${designerId}/photo`)
        expect(res.status).toEqual(200)
        expect(res.body._id).toBeDefined()
        expect(res.body._id).toEqual(designerId)
        expect(Array.isArray(res.body.photo_ids)).toBeTruthy()
        expect(res.body.photo_ids.length).toEqual(1)
        const gotPhoto: PhotoI = res.body.photo_ids[0]
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
