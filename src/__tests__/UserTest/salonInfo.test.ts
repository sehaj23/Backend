import app from "../../app";
import * as request from "supertest";
import * as db from "../../database";
import { VendorI } from "../../interfaces/vendor.interface";
import { SalonI } from "../../interfaces/salon.interface";
import * as faker from "faker";

const TIME = 30000;
beforeAll(async (done) => {
  await db.connectt();
  done();
}, TIME);

const getSalon: (vendorId) => SalonI = (vendorId) => {
  const email = faker.internet.email();
  const date = new Date();
  const dataToSend: SalonI = {
    name: "zz",
    contact_number: "1234567890",
    description: "desc",
    email: email,
    end_price: 20000,
    start_price: 10000,
    start_working_hours: [date, null, null, null],
    end_working_hours: [date, null, null, null],
    location: "Chicago",
    speciality: ["DM"],
    latitude:27,
    longitude:35,
    vendor_id: vendorId,
  };
  return dataToSend;
};

describe("User Salon Info test", () => {
  let vendorId;
  let salonid;
  let token;
  let res;
  beforeAll(async (done) => {
    const v: VendorI = {
      email: "aman@gmail.com",
      password: "aman23",
      name: "Aman",
      contact_number: "+12193860967",
    };

    res = await request(app).post("/api/v/login/create").send(v);
    expect(res.status).toEqual(200);
  
    vendorId = res.body._id;

    const login = {
      password: "aman23",
      email: "aman@gmail.com",
    };
    res = await request(app).post("/api/v/login/").send(login);
    expect(res.body.token).toBeDefined();
   
    token = res.body.token;

    const dataToSend = getSalon(vendorId);
    res = await request(app)
      .post("/api/v/salon")
      .set("authorization", "Bearer " + token)
      .send(dataToSend);
    

    expect(res.body._id).toBeDefined();
    salonid = res.body._id;
   
    expect(res.status).toEqual(200);

    done();
  }, TIME);

 

test(
  "User Salon Info - Successful ",
  async (done) => {
  
    res = await request(app).get(`/api/u/salon/location/`);
    
    expect(res.status).toEqual(200);
    console.log("3")
    done();
  },
  TIME
);
test(
  "Salon location near me - Successfull ",
  async (done) => {
    const dataToSend = getSalon(vendorId);
    res = await request(app).get(`/api/u/salon/location/?longitude=${dataToSend.longitude}&latitude=${dataToSend.latitude}`);
    expect(res.body).toBeDefined()
    expect(res.status).toEqual(200);

    done();
  },
  TIME
);

test(
  "Salon distance near me (SORTED)",
  async (done) => {
    const dataToSend = getSalon(vendorId);
    res = await request(app).get(`/api/u/salon/location/?longitude=${dataToSend.longitude}&latitude=${dataToSend.latitude}&km=100`);
    expect(Array.isArray(res.body)).toEqual(true)
    expect(res.status).toEqual(200);
    done();
  },
  TIME
);


});




afterAll(async (done) => {
  await db.disconnect();
  done();
});
