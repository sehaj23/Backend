import app from "../../app";
import * as request from "supertest"
import mongoose, * as db from "../../database"
import * as faker from "faker"
import { BookingI } from "../../interfaces/booking.interface"
import ServiceSI from "../../interfaces/service.interface"
import User from "../../models/user.model"
import Services from "../../models/service.model"
import user from "../../interfaces/user.interface"
import { MakeupArtistI } from "../../interfaces/makeupArtist.interface";
import { VendorI } from "../../interfaces/vendor.interface";
import { SalonI } from "../../interfaces/salon.interface";
import { DesignersI } from "../../interfaces/designer.interface";
import Booking from "../../models/booking.model";
import { EmployeeI } from "../../interfaces/employee.interface";



const TIME = 30000
beforeAll(async (done) => {
    await db.connectt()
    done()
})

describe('Bookings service test', () => {
    let vendorId
    let serviceid
    let userid
    let salonid
    let bookingid
    let muaid
    let designerid
    let empid
    let token
    beforeAll(async (done) => {
        const v: VendorI = {
            name: "Sehajchawla",
            password: "sehaj23",
            "contact_number": "+12193860967",
            email: "sehajchawla233@gmail.com"
        }
        const Vendoreres = await request(app).post("/api/v/login/create").send(v)

        const login = {
            password: "sehaj23",
            email: "sehajchawla233@gmail.com"

        }
        const res2 = await request(app).post("/api/v/login/").send(login)
        expect(res2.body.token).toBeDefined()
        token = (res2.body.token)
        
    
    

        vendorId = Vendoreres.body._id

        const us: user = {
            name: "sehaj",
            email: "sehakasndna@gmail.com",
            password: "sehaj233"


        }
        const Useres = await User.create(us)
        userid = Useres._id

        const s: ServiceSI = {
            name: "sehaj",
            price: 200,
            duration: 15,
            gender:"men"


        }
        const Serviceres = await Services.create(s)
        serviceid = Serviceres._id

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
            "vendor_id": ""
        }
        const salonres = await request(app).post("/api/v/salon").set('authorization',"Bearer "+token).send(dataToSend)
        salonid = salonres.body._id
        console.log("salone id", salonid)
        console.log("userid", userid)
        console.log("service", serviceid)
        done()
    })

    const getMUA:()=>MakeupArtistI =()=>{
        const date = new Date();
        const email = faker.internet.email()
    
        const dataToSend = {
    
            "name": "zolo",
            "designer_name": "hello1",
            "contact_number": "1234567890",
            "description": "desc",
            "email": email,
            "end_price": 20000,
            "start_price": 10000,
            "start_working_hours": [date, null, null, null],
            "end_working_hours": [date, null, null, null],
            "location": "delhi",
            "speciality": ["Design"],
            "vendor_id": "",
        };
        return dataToSend
    }
    test("Makeup Artist Post", async (done) => {

        const dataToSend = getMUA()
        const res = await request(app).post("/api/v/makeupArtist").set('authorization',"Bearer "+token).send(dataToSend);

        expect(res.body._id).toBeDefined();
        muaid = res.body._id
        // check response vendor ID problem
        expect(res.body.name).toEqual(dataToSend.name);
        expect(res.body.start_working_hours).toBeDefined();
        expect(res.body.speciality).toEqual(dataToSend.speciality);
        expect(res.body.start_price).toEqual(dataToSend.start_price);
        expect(res.body.approved).toBeFalsy();
        expect(res.status).toEqual(200);
        done();
    });

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
            "store_type":"Retail shop"
        }
        return dataToSend
    }
    test('Designers Post', async done => {
        const dataToSend = getDesigner(vendorId)
        const res = await request(app).post("/api/v/designer").set('authorization',"Bearer "+token).send(dataToSend)
        expect(res.body._id).toBeDefined()
        designerid = res.body._id
        expect(res.body.brand_name).toEqual(dataToSend.brand_name)
        expect(res.body.start_working_hours).toBeDefined()
        expect(res.body.speciality).toEqual(dataToSend.speciality)
        expect(res.body.start_price).toEqual(dataToSend.start_price)
        expect(res.status).toEqual(200)
        done()
    }, TIME)


    test("bookings insert", async done => {
        const date = new Date()
        const date1 = new Date()
        const b: BookingI = {
            "salon_id": salonid,
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
        const book = await request(app).post("/api/v/bookings").send(b)
        expect(book.body._id).toBeDefined()
        bookingid = book.body._id
        expect(book.body.price).toEqual(b.price)
        expect(book.body.balance).toEqual(b.balance)
        expect(book.status).toEqual(200)
        console.log(book.body)

        done()
    })


    test("get booking by ID",async done=>{
        const book = await request(app).get("/api/v/bookings/"+bookingid)
        expect(book.body._id).toEqual(bookingid)
        expect(book.status).toEqual(200)
        done()

    })

    test("get all bookings",async done=>{
        const book = await request(app).get("/api/v/bookings")
        console.log(book.body)
        expect(book.status).toEqual(200)
        done()
    })

    test("get salon bookings",async done=>{
        const book = await request(app).get("/api/v/bookings/salon/"+salonid)
        console.log(book.body)
        expect(book.body).toBeDefined()
        expect(book.status).toEqual(200)
        done()

    })
    test("get makeupArtist bookings",async done=>{
        const book = await request(app).get("/api/v/bookings/makeupArtist/"+muaid)
        expect(book.body).toBeDefined()
        expect(book.status).toEqual(200)
        done()

    })
    test("get designer bookings",async done=>{
        const book = await request(app).get("/api/v/bookings/designer/"+designerid)
        expect(book.body).toBeDefined()
        expect(book.status).toEqual(200)
        done()

    })

    test("get pending designer bookings",async done=>{
        const book = await request(app).get("/api/v/bookings/pending/designer/"+designerid)
        expect(book.body).toBeDefined()
        expect(book.status).toEqual(200)
        done()

    })
    test("get pending mua bookings",async done=>{
        const book = await request(app).get("/api/v/bookings/pending/makeupArtist/"+muaid)
        expect(book.body).toBeDefined()
        expect(book.status).toEqual(200)
        done()

    })
    test("get pending salon bookings",async done=>{
        const book = await request(app).get("/api/v/bookings/pending/salon/"+salonid)
        expect(book.body).toBeDefined()
        expect(book.status).toEqual(200)
        done()

    })
    test("update  booking status",async done=>{
        const data = {
            status:"Completed"
        }
        const book = await request(app).patch("/api/v/bookings/updatestatus/"+bookingid).send(data)
        expect(book.body._id).toEqual(bookingid)
        expect(book.body.status).toEqual(data.status)
        expect(book.status).toEqual(200)
        done()

    })

    test("reschedule booking",async done=>{
        const data = {
            date_time:"2021-04-23"
        }
        const book = await request(app).patch("/api/v/bookings/reschedule/"+bookingid).send(data)
        expect(book.body._id).toEqual(bookingid)
        expect(book.body.date_time).toBeDefined()
        expect(book.status).toEqual(200)
        done()

    })

    const e: EmployeeI = {
        name: "sehaj",
        phone: "9711841198",
        services: ["5eaa0788df36ecbc2d2b0ed3"]

    }

    test("add employee", async done => {
        const res = await request(app).post("/api/v/employee").send(e)
        expect(res.body._id).toBeDefined()
        empid = res.body._id
        expect(res.body.phone).toBeDefined()
        expect(res.status).toEqual(200)
        done()



})
    test("assign employee",async done=>{
        const data = {
            employee_id:empid,
            service_name:"haircut"
        }
        const res = await request(app).put("/api/v/bookings/assignEmployee/"+bookingid).send(data)
       // expect(res.body.employee_id).toEqual(data.employee_id) use of {new:true}
        expect(res.status).toEqual(200)
        done()

    })
})

afterAll(async (done) => {
    await db.disconnect()
    done()
})

