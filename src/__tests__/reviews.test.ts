import app from "../app";
import * as request from "supertest"
import mongoose, * as db from "../database"
import * as faker from "faker"
import ReviewSI from "../interfaces/review.interface"
import Reviews from "../models/review.model"
import {VendorI} from "../interfaces/vendor.interface"
import {DesignersI} from "../interfaces/designer.interface"

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
        "vendor_id": vendorId
    }
    return dataToSend
}

describe('Designer service test', () => {

    let vendorId
    let designerId;
    let reviewid;



    beforeAll(async (done) => {
        const v: VendorI = {
            name: "sehaj",
            password: "sehaj23",
            "contact_number": "123456789",
            "email": "sehakldnaslnkdlnk@gmail.com"
        }
        const res = await request(app).post("/api/vendor/login/create").send(v)
        expect(res.body._id).toBeDefined()
        vendorId = res.body._id

        done()
    })

    test('Designers Post', async done => {
        const dataToSend = getDesigner(vendorId)
        const res = await request(app).post("/api/vendor/designer").send(dataToSend)
        expect(res.body._id).toBeDefined()
        designerId = res.body._id
        expect(res.body.brand_name).toEqual(dataToSend.brand_name)
        expect(res.body.start_working_hours).toBeDefined()
        expect(res.body.speciality).toEqual(dataToSend.speciality)
        expect(res.body.start_price).toEqual(dataToSend.start_price)
        expect(res.status).toEqual(200)
        done()
    })




    
   



//@ts-ignore
    const i:ReviewSI={
        message:"good",
        rating:5,
        designer_id:designerId
    }
    test("Review post",async done=>{
        const res = await request(app).post("/api/vendor/reviews").send(i)
        expect(res.body._id).toBeDefined()
        expect(res.status).toBe(200)
        reviewid = res.body._id
        done()


    })


})

