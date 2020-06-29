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
    console.log("CREATE VENDOR", res.body);
    vendorId = res.body._id;

    const login = {
      password: "aman23",
      email: "aman@gmail.com",
    };
    res = await request(app).post("/api/v/login/").send(login);
    expect(res.body.token).toBeDefined();
    console.log("LOGIN VENDOR", res.body);
    token = res.body.token;

    const dataToSend = getSalon(vendorId);
    res = await request(app)
      .post("/api/v/salon")
      .set("authorization", "Bearer " + token)
      .send(dataToSend);
    console.log("PASS TOKEN", res.body);

    expect(res.body._id).toBeDefined();
    salonid = res.body._id;
    console.log("SALON ID : ", salonid);
    expect(res.status).toEqual(200);

    done();
  }, TIME);

  test(
    "User Salon Info - Successful ",
    async (done) => {
      console.log(salonid);
      res = await request(app).get(`/api/u/salon/${salonid}`);
      console.log("SALON INFO", res.body);
      expect(res.status).toEqual(200);
      console.log("3")
      done();
    },
    TIME
  );
});

afterAll(async (done) => {
  console.log("1")
  await db.disconnect();
console.log("2")
  done();
});
