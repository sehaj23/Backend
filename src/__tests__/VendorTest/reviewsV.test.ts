import app from "../../app";
import * as request from "supertest"
import mongoose, * as db from "../../database"
import * as faker from "faker"

import ReviewSI from "../../interfaces/review.interface"
import Reviews from "../../models/review.model"
import { VendorI } from "../../interfaces/vendor.interface"
import { DesignersI } from "../../interfaces/designer.interface"

const TIME = 30000
beforeAll(async (done) => {
    await db.connectt()
    done()
})
const getDesigner: (vendorId: string) => DesignersI = (vendorId: string) => {
    const email = faker.internet.email()
    const date = new Date()
    const dataToSend: DesignersI = {
        "brand_name": "hello",
        "contact_number": "1234567890",
        "description": "desc",
        "designer_name": "sehaj",
        "email": email,
        "end_price": 230000,
        "start_price": 100001,
        "start_working_hours": [date, null, null, null],
        "end_working_hours": [date, null, null, null],
        "location": "Noida",
        "speciality": ["DM"],
        "outfit_types": ["Good outfits"],
        "vendor_id": "",
        "store_type":"Retail shop",
    }
    return dataToSend
}

describe('Designer service test', () => {

    let vendorId
    let designerId;
    let reviewid;
    let token
    let email



    beforeAll(async (done) => {
        email = faker.internet.email()
        const v: VendorI = {
            name: "sehaj",
            password: "sehaj23",
            "contact_number": "123456789",
            email: email
        }
        const res = await request(app).post("/api/v/login/create").send(v)
        expect(res.body._id).toBeDefined()
        vendorId = res.body._id

        done()
    })
    beforeAll(async (done) => {
        const login = {
            password: "sehaj23",
            email: email

        }
        const res2 = await request(app).post("/api/v/login/").send(login)
        expect(res2.body.token).toBeDefined()
        token = (res2.body.token)
        done()
    
    })


    test('Designers Post', async done => {
        const dataToSend = getDesigner(vendorId)
        const res = await request(app).post("/api/v/designer").set('authorization',"Bearer "+token).send(dataToSend)
        expect(res.body._id).toBeDefined()
        designerId = res.body._id
        expect(res.body.brand_name).toEqual(dataToSend.brand_name)
        expect(res.body.start_working_hours).toBeDefined()
        expect(res.body.speciality).toEqual(dataToSend.speciality)
        expect(res.body.start_price).toEqual(dataToSend.start_price)
        expect(res.status).toEqual(201)
        done()
    })







    //@ts-ignore
    const i: ReviewSI = {
        message: "good",
        rating: 5,
        designer_id: designerId
    }
    test("Review post", async done => {
        const res = await request(app).post("/api/v/reviews").set('authorization',"Bearer "+token).send(i)
        console.log(res.body)
        expect(res.body._id).toBeDefined()
        expect(res.status).toBe(201)
        reviewid = res.body._id
        done()


    })
    test("All review", async done => {
        const res = await request(app).get("/api/v/reviews").set('authorization',"Bearer "+token)
        expect(res.status).toBe(200)
        done()

    })
    test("Reviews reply", async done => {
        const res = await request(app).put("/api/v/reviews/reply/" + reviewid).set('authorization',"Bearer "+token)
        expect(res.status).toBe(200)
        expect(res.body._id).toEqual(reviewid)
        done()

    })
    test("Flag Reviews", async done => {
        const res = await request(app).put("/api/v/reviews/report/" + reviewid).set('authorization',"Bearer "+token)
        expect(res.status).toBe(200)
        expect(res.body.flagged).toBeTruthy()
        done()

    })

    afterAll(async (done) => {
        await db.disconnect();
        done();
      });

})

