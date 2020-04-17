import app from "../app";
import * as request from "supertest";
import { VendorI } from "../interfaces/vendor.interface";
import * as db from "../database";
import { DesignersI } from "../interfaces/designer.interface";
import EventI from "../interfaces/event.interface";
import EventDesignerI from "../interfaces/eventDesigner.model";
import { MakeupArtistI } from "../interfaces/makeupArtist.interface";
import { EventMakeupArtistI } from "../interfaces/eventMakeupArtist.interface";
jest.setTimeout(30000)
beforeAll(async (done) => {
    await db.connectt();
    done();
});

describe("Makeup Artist service test", () => {
    let vendorId;
    let makeupArtistId;

    const date = new Date();
    let dataToSend: MakeupArtistI;

    const date1 = new Date();
    const e: EventI = {
        description: "Evend des",
        end_date_time: date1,
        entry_procedure: "Get money",
        exhibition_house: "My house",
        location: "Chicago",
        name: "Cool Event",
        start_date_time: date1,
    };

    beforeAll(async (done) => {
        const v: VendorI = {
            name: "Preet",
            password: "Preet123",
            contact_number: "123456789",
            email: "preetsc27aa@gmail.com",
        };
        const res = await request(app).post("/api/vendor").send(v);
        vendorId = res.body._id;
        dataToSend = {
            name: "zz",
            contact_number: "1234567890",
            description: "desc",
            email: "email@gmail.com",
            end_price: 20000,
            start_price: 10000,
            start_working_hours: [date, null, null, null],
            end_working_hours: [date, null, null, null],
            location: "Chicago",
            speciality: ["DM"],
            vendor_id: vendorId,
        };
        done();
    });

    test("Makeup Artist Post", async (done) => {
        const res = await request(app).post("/api/makeupArtist").send(dataToSend);
        expect(res.body._id).toBeDefined();
        makeupArtistId = res.body._id;
        expect(res.body.name).toEqual(dataToSend.name);
        expect(res.body.start_working_hours).toBeDefined();
        expect(res.body.speciality).toEqual(dataToSend.speciality);
        expect(res.body.start_price).toEqual(dataToSend.start_price);
        expect(res.body.approved).toBeFalsy();
        expect(res.status).toEqual(200);
        done();
    });

    test("Add Event to Makeup Artist", async (done) => {
        const res = await request(app).post("/api/event").send(e);
        expect(res.status).toEqual(200);
        expect(res.body._id).toBeDefined();
        const event_id = res.body._id;
        const data: EventMakeupArtistI = {
            event_id,
            makeup_artist_id: makeupArtistId,
        };
        const res2 = await request(app).post("/api/makeupArtist/event").send(data);
        expect(res2.status).toEqual(200);
        done();
    });

    test("Check for Event in Makeup Artist", async (done) => {
        const res = await request(app).get(`/api/makeupArtist/${makeupArtistId}`);
        expect(res.status).toEqual(200);
        expect(Array.isArray(res.body.events)).toBeTruthy();
        const event: EventI = res.body.events[0];
        expect(event.description).toEqual(e.description);
        expect(event.exhibition_house).toEqual(e.exhibition_house);
        expect(event.name).toEqual(e.name);
        done();
    });

    test("Update Makeup Artist PUT", async (done) => {
        dataToSend.name = "The Brand";
        const res = await request(app)
            .put(`/api/makeupArtist/${makeupArtistId}`)
            .send(dataToSend);
        expect(res.body.name).toEqual(dataToSend.name);
        expect(res.body.start_working_hours).toBeDefined();
        expect(res.body.speciality).toEqual(dataToSend.speciality);
        expect(res.body.start_price).toEqual(dataToSend.start_price);
        expect(res.status).toEqual(200);
        done();
    });
});
afterAll(async (done) => {
    await db.disconnect();

    done();
});