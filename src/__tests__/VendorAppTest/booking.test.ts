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
import { duration } from "moment";
import * as moment from "moment"



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
        const Vendor_res = await request(app).post("/api/v/login/create").send(v)

        const login = {
            password: "sehaj23",
            email: "sehajchawla233@gmail.com"

        }
        const res2 = await request(app).post("/api/v/login/").send(login)
        expect(res2.body.token).toBeDefined()
        token = (res2.body.token)
        vendorId = Vendor_res.body._id
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
        const Service_res = await Services.create(s)
        serviceid = Service_res._id
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
        const salon_res = await request(app).post("/api/v/salon").set('authorization',"Bearer "+token).send(dataToSend)
        salonid = salon_res.body._id
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
            "start_working_hours": [date, date, date,date],
            "end_working_hours": [date, date,date,date],
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

    const e: EmployeeI = {
        name: "sehaj",
        phone: "9711841198",
        services: ["5eaa0788df36ecbc2d2b0ed3"]

    }


    test("add employee", async done => {
        const res = await request(app).put(`/api/v/salon/${salonid}/employee`).set('authorization',"Bearer "+token).send(e)
        expect(res.body._id).toBeDefined()
        empid = res.body._id
      
        expect(res.status).toEqual(200)
        done()

    })

    test("bookings insert", async done => {
        const date = new Date()
        const date1 = new Date()
        const b: BookingI = {
            "salon_id": salonid,
            "user_id": userid,
            "services": [{
                "service_name": "haircut",
                "employee_id":empid,
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
            "payment_type": "COD",
            "status":"Completed"

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

   

    test("get  bookings completed",async done=>{
        const book = await request(app).get("/api/vendorapp/booking/?status=Completed")
        console.log(book.body)
        expect(book.status).toEqual(200)
        // expect(book.body.status).toEqual(expect.arrayContaining(Completed));
        expect(book.body.bookingDetails).toEqual(expect.arrayContaining([expect.objectContaining({status:"Completed"})]))
       // expect(book.body.bookingDetails).toContainEqual(expect.objectContaining({status:"Completed"}))
        done()
    })

    test("get reschedule slots",async done=>{
        const res = await request(app).get(`/api/vendorapp/booking/reschedule/${salonid}`)
        expect(res.status).toEqual(200)
        expect(res.body).toBeDefined()
        done()
    })

    test("reschedule Booking",async done=>{
        const dataToSend = {
            date_time:moment().add(2, 'days')
        }
        const res = await request(app).patch(`/api/vendorapp/booking/reschedule/${bookingid}`).send(dataToSend)  
        expect(res.status).toEqual(200)
        expect(res.body.status).toEqual("Requested")
        expect(res.body).toBeDefined()  
        done()
    })

    test("Change Booking status",async done=>{
        const dataToSend = {
            status:"Completed"
        }
        const res = await request(app).patch(`/api/vendorapp/booking/updatestatus/${bookingid}`).send(dataToSend)
        expect(res.status).toEqual(200)
        expect(res.body.status).toEqual(dataToSend.status)
        expect(res.body).toBeDefined()
        done()
    })

    test("Get all status",async done=>{
        const res = await request(app).get(`/api/vendorapp/booking/status`)
        expect(res.status).toEqual(200)
        expect(res.body).toBeDefined()
        expect(res.body).toEqual(['Requested', 'Confirmed', 'Vendor Cancelled', 'Reschedule','Reschedule and Cancelled'])
       
        done()
    })


    //Employeee
    
    const s = {
        phone:"9711841198",
        otp:"1234"
    }

    test("Login employee", async done => {
        const res = await request(app).post("/api/vendorapp/employee").send(s) 
        expect(res.body.token).toBeDefined()
        token = res.body.token;
        expect(res.status).toEqual(200)
        done()

    })
    
    test("get employee Bookings",async done=>{
        const res = await request(app).get(`/api/vendorapp/booking/employee/`).set('authorization',"Bearer "+token)
        expect(res.status).toEqual(200)
        console.log(res.body)
        expect(res.body).toBeDefined()
        done()
    })
    test("Change Booking status",async done=>{
        const dataToSend = {
            status:"Requested"
        }
        const res = await request(app).patch(`/api/vendorapp/booking/employee/updatestatus/${bookingid}`).set('authorization',"Bearer "+token).send(dataToSend)
        expect(res.status).toEqual(200)
        console.log(res.body)
        expect(res.body.status).toEqual(dataToSend.status)
        expect(res.body).toBeDefined()
        done()
    })

   
   


})

afterAll(async (done) => {
    await db.disconnect()
    done()
})

