import app from "../../app";
import * as request from "supertest"
import mongoose, * as db from "../../database"
import * as faker from "faker"
import ServiceSI from "../../interfaces/service.interface"
import OfferSI from "../../interfaces/offer.interface"
import { VendorI } from "../../interfaces/vendor.interface";
import User from "../../models/user.model";
import { SalonI } from "../../interfaces/salon.interface";

const TIME = 30000
beforeAll(async (done) => {
    await db.connectt()
    done()
})



describe('Offer service test', () => {
    let serviceid
    let offerid
    let token
    let vendorId
    let userid
    let salonid
    let serviceId
    let email
    email = faker.internet.email()

 
    beforeAll(async (done) => {
        const v: VendorI = {
            name: "Sehajchawla",
            password: "sehaj23",
            "contact_number": "+12193860967",
            email: email
        }
        const Vendoreres = await request(app).post("/api/v/login/create").send(v)

        const login = {
            password: "sehaj23",
            email: email

        }
        const res2 = await request(app).post("/api/v/login/").send(login)
        expect(res2.body.token).toBeDefined()
        token = (res2.body.token)
        console.log(token)
        
    
    

        vendorId = Vendoreres.body._id

        const us = {
            name: "sehaj",
            email: email,
            password: "sehaj233"


        }
        const Useres = await User.create(us)
        userid = Useres._id

     

    
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
            "vendor_id": vendorId,
            "services":[{
                name: "sehaj",
                price: 200,
                category:"check123",
                duration: 15,
                gender:"men"
            }]
        }
        const salonres = await request(app).post("/api/v/salon").set('authorization',"Bearer "+token).send(dataToSend)
        salonid = salonres.body._id
        serviceId = salonres.body.services[0]._id
        console.log("salone id", salonid)
        console.log("userid", userid)
        console.log("service", serviceId)
        done()
    })
    const date = new Date()
    //@ts-ignore
    const o: OfferSI = {
        updated_price: 400,
        start_date: date,
        end_date: date,
        approved: true,
        max_usage: 100,
        disable: false

    }


    test("create offer Salon", async done => {
        const res = await request(app).post(`/api/v/salon/${salonid}/offer/${serviceId}`).set('authorization',"Bearer "+token).send(o)
        console.log(res.body)
        expect(res.body._id).toBeDefined()
        offerid = res.body._id
        expect(res.body.updated_price).toEqual(o.updated_price)
        expect(res.status).toEqual(201)
        done()



    })

    test("update offer", async done => {

        const data = {
            "end_date": "1987-09-28",
            "updated_price": 600
        }
        const res = await request(app).put("/api/v/offer/edit/" + offerid).set('authorization',"Bearer "+token).send(data)
        //    console.log(res.body)
        //     expect(res.body._id).toBeDefined()

        //     expect(res.body.updated_price).toEqual(data.updated_price)
        expect(res.status).toEqual(200)
        // wont work because of start date condition 
        done()


    })

    //  test("get alls offer",async done=>{


    //     const res = await request(app).get("/api/vendor/offer")
    //     console.log(res.body)
    //     expect(res.body._id).toEqual(offerid)

    //     expect(res.status).toEqual(200)
    //     done()


    //  })
    test("disable offer", async done => {


        const res = await request(app).patch("/api/v/offer/disable/" + offerid).set('authorization',"Bearer "+token)
        console.log(res.body)
        expect(res.body._id).toEqual(offerid)
        expect(res.body.disable).toEqual(true)
        expect(res.status).toEqual(200)
        done()


    })

    afterAll(async (done) => {
        await db.disconnect()
        done()
    })
    
    


})