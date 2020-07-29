import app from "../../app";
import * as request from "supertest";
import { VendorI } from "../../interfaces/vendor.interface";
import * as db from "../../database";
import { DesignersI } from "../../interfaces/designer.interface";
import EventI from "../../interfaces/event.interface";
import EventDesignerI from "../../interfaces/eventDesigner.model";
import { MakeupArtistI } from "../../interfaces/makeupArtist.interface";
import { EventMakeupArtistI } from "../../interfaces/eventMakeupArtist.interface";
import { PhotoI } from "../../interfaces/photo.interface";
import * as faker from "faker"
const TIME = 40000
beforeAll(async (done) => {
    await db.connectt();
    done();
});

const getMUA:()=> MakeupArtistI=() => {
    const date = new Date();
    const email = faker.internet.email()

    const dataToSend:MakeupArtistI = {

        "name": "zolo",
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
        "services":[
            {
                name: "sehaj",
                price: 200,
                duration: 15,
                gender:"men"
            }
        ]
    };
    return dataToSend
}
describe("Makeup Artist service test", () => {
    let muaid
    let vendorId
    let token
    beforeAll(async (done) => {
        const v: VendorI = {
            name: "sehaj",
            password: "sehaj23",
            contact_number: "123456789",
            email: "sehajakdsjbdkasnbjd@gmail.com",
        };

        const res = await request(app).post("/api/v/login/create").send(v);

        vendorId = res.body._id;

        done();
    });

    beforeAll(async (done) => {
        const login = {
            password: "sehaj23",
            email: "sehajakdsjbdkasnbjd@gmail.com",

        }
        const res2 = await request(app).post("/api/v/login/").send(login)
        expect(res2.body.token).toBeDefined()
        token = (res2.body.token)
        done()
    
    })


    test("Makeup Artist Post", async (done) => {

        
        const dataToSend = getMUA()
       
        const res = await request(app).post("/api/v/makeupArtist").set('authorization',"Bearer "+token).send(dataToSend);
        console.log(res.body)
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

    test('MUA settings test', async done => {
        const mua = {
            name: "hello12345",
            location: "OZARK"
        }
        console.log(muaid)

        const res = await request(app).put("/api/v/makeupArtist/settings/" + muaid).set('authorization',"Bearer "+token).send(mua)

        expect(res.body.name).toEqual(mua.name)

        expect(res.body.location).toEqual(mua.location)
        expect(res.status).toEqual(200)
        done()
    },TIME)
    

    test('MUA settings test add service', async done => {
        const service={
                services:[{
                    name:"sehaj123",
                    price:123,
                    duration:15,
                    gender:"men"
                    
                    
                },{
                    
                    name:"sehaj23",
                    price:123,
                    duration:15,
                    gender:"women"
                    
                    
                }]
        }
        const res = await request(app).put(`/api/v/makeupArtist/${muaid}/service`).set('authorization',"Bearer "+token).send(service)
        console.log(res.body)
        expect(res.body).toBeDefined()
        expect(res.status).toBe(200)
        done()
    })

    test('MUA settings test-get services', async done => {
        const res = await request(app).get(`/api/v/makeupArtist/${muaid}/service`).set('authorization',"Bearer "+token)
        expect(res.body).toBeDefined()
        expect(res.status).toBe(200)
        done()

    })



});

afterAll(async (done) => {
    await db.disconnect()
    done()
})

