import app from "../app";
import * as request from "supertest";
import { VendorI } from "../interfaces/vendor.interface";
import * as db from "../database";
import { DesignersI } from "../interfaces/designer.interface";
import EventI from "../interfaces/event.interface";
import EventDesignerI from "../interfaces/eventDesigner.model";
import { MakeupArtistI } from "../interfaces/makeupArtist.interface";
import { EventMakeupArtistI } from "../interfaces/eventMakeupArtist.interface";
import { PhotoI } from "../interfaces/photo.interface";
import * as faker from "faker"
const TIME = 30000
beforeAll(async (done) => {
    await db.connectt();
    done();
});

const getMUA: (vendorId: string) => MakeupArtistI = (vendorId: string) => {
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
        "vendor_id": vendorId,
    };
    return dataToSend
}
describe("Makeup Artist service test", () => {
    let muaid
    let vendorId
    beforeAll(async (done) => {
        const v: VendorI = {
            name: "sehaj",
            password: "sehaj23",
            contact_number: "123456789",
            email: "sehajakdsjbdkasnbjd@gmail.com",
        };

        const res = await request(app).post("/api/vendor/login/create").send(v);

        vendorId = res.body._id;

        done();
    });

    test("Makeup Artist Post", async (done) => {

        expect(vendorId).toBeDefined()
        const dataToSend = getMUA(vendorId)
        const res = await request(app).post("/api/vendor/makeupArtist").send(dataToSend);

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

        const res = await request(app).put("/api/vendor/makeupArtist/settings/" + muaid).send(mua)

        expect(res.body.name).toEqual(mua.name)

        expect(res.body.location).toEqual(mua.location)
        expect(res.status).toEqual(200)
        done()



    })

});

afterAll(async (done) => {
    await db.disconnect()
    done()
})

