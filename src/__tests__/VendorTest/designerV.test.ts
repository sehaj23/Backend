import app from "../../app";
import * as request from "supertest"
import { VendorI } from "../../interfaces/vendor.interface";
import mongoose, * as db from "../../database"
import { DesignersI } from "../../interfaces/designer.interface";
import EventI from "../../interfaces/event.interface";
import EventDesignerI from "../../interfaces/eventDesigner.model";
import { PhotoI } from "../../interfaces/photo.interface";
import * as faker from "faker"

const TIME = 40000
beforeAll(async (done) => {
    await db.connectt()
    done()
}, TIME)

const getDesigner:()=> DesignersI=() => {
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
        "store_type":"Retail shop",
        "vendor_id": ""
    }
    return dataToSend
}

describe('Designer service test', () => {

    let vendorId
    let DesignerId;
    let token;



    beforeAll(async (done) => {
        const v: VendorI = {
            name: "sehaj",
            password: "sehaj23",
            contact_number: "123456789",
            email: "sehaj233@gmail.com"
        }
       
        const res = await request(app).post("/api/v/login/create").send(v)
        expect(res.body._id).toBeDefined()
       
      
       

        done()
    }, TIME)

    beforeAll(async (done) => {
        const login = {
            password: "sehaj23",
            email: "sehaj233@gmail.com"

        }
        const res2 = await request(app).post("/api/v/login/").send(login)
        expect(res2.body.token).toBeDefined()
        token = (res2.body.token)
        done()
    
    })

    test('Designers Post', async done => {
        console.log(token)
        const dataToSend = getDesigner()      
        const res = await request(app).post("/api/v/designer").set('authorization',"Bearer "+token).send(dataToSend)
        expect(res.body._id).toBeDefined()
        DesignerId = res.body._id
        expect(res.body.brand_name).toEqual(dataToSend.brand_name)
        expect(res.body.start_working_hours).toBeDefined()
        expect(res.body.speciality).toEqual(dataToSend.speciality)
        expect(res.body.start_price).toEqual(dataToSend.start_price)
        expect(res.status).toEqual(200)
        done()
    }, TIME)

    test('Designers settings test', async done => {
        const designer = {
            designer_name: "hello12345",
            location: "OZARK"
        }

        const res = await request(app).put("/api/v/designer/settings/" + DesignerId).set('authorization',"Bearer "+token).send(designer)

        expect(res.body.designer_name).toEqual(designer.designer_name)

        expect(res.body.location).toEqual(designer.location)
        expect(res.status).toEqual(200)
        done()



    })
})

afterAll(async (done) => {
    await db.disconnect()
    done()
})

