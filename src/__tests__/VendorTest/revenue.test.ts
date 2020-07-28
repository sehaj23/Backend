import app from "../../app";
import * as request from "supertest"
import mongoose, * as db from "../../database"
import * as faker from "faker"
import { BookingI } from "../../interfaces/booking.interface"
import ServiceSI from "../../interfaces/service.interface"
import User from "../../models/user.model"
import user from "../../interfaces/user.interface"
import { VendorI } from "../../interfaces/vendor.interface";
import { SalonI } from "../../interfaces/salon.interface";
import Booking from "../../models/booking.model";


const TIME = 30000
beforeAll(async (done) => {
    await db.connectt()
    done()
})

describe('Bookings service test', () => {
    let vendorId
    let serviceid
    let userid
    let saloinid
    let token
    beforeAll(async (done) => {
        const v: VendorI = {
            name: "Sehajchawla",
            password: "sehaj23",
            contact_number: "+12193860967",
            email: "sehajchawla233@gmail.com"
        }
        const res = await request(app).post("/api/v/login/create").send(v)
    
   
            const login = {
                email: "sehajchawla233@gmail.com",
                password: "sehaj23"
                
            }
            const res2 = await request(app).post("/api/v/login/").send(login)
            expect(res2.body.token).toBeDefined()
            token = (res2.body.token)
            console.log(token)
            
        
       

        const us: user = {
            name: "sehaj",
            email: "sehakasndna@gmail.com",
            password: "sehaj233"


        }
        const Useres = await User.create(us)
        userid = Useres._id
        const email = faker.internet.email()
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
            "vendor_id": "",
            "services":[
                {
                    name: "sehaj",
                    price: 200,
                    duration: 15,
        
                    gender:"men"
                }
            ]
        }
        const salonRes = await request(app).post("/api/v/salon").set('authorization',"Bearer "+token).send(dataToSend)
        saloinid = salonRes.body._id


        serviceid = salonRes.body.services[0]._id

        console.log(saloinid)
        console.log(userid)
        console.log(serviceid)
        done()
    })


    test("bookings insert", async done => {
        const date = new Date()
        const date1 = new Date()
        const b: BookingI = {
            "salon_id": saloinid,
            "user_id": userid,
            "services": [{

                "service_name": "haircut",
                "service_real_price": 500,
                "service_total_price": 500,
                "zattire_commission": 400,
                "vendor_commission": 100,
                "service_time": date,
                "service_id": serviceid,

            }],
            "price": 200,
            "balance": 500,
            "date_time": date,
            "location": "Vendor Place",
            "payment_type": "COD"

        }
        const book = await request(app).post("/api/v/bookings").set('authorization',"Bearer "+token).send(b)
        console.log(book.body)

        expect(book.body._id).toBeDefined()
        expect(book.body.price).toEqual(b.price)
        expect(book.body.balance).toEqual(b.balance)
        expect(book.status).toEqual(201)
       
        done()
    })

    test("Fetch Revenue",async done=>{
        console.log(saloinid)
        const s = {
            salon_id:saloinid
        }

        const res = await request(app).get("/api/v/revenue/?salon_id="+saloinid)
    
        expect(res.status).toBe(200)
        expect(res.body).toBeDefined()
        done()
        


    })







})
afterAll(async (done) => {
    await db.disconnect()
    done()
})

