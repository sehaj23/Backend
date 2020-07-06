import app from "../../app";
import * as request from "supertest";
import * as db from "../../database";
import UserI from "../../interfaces/user.interface";

const TIME = 30000;

beforeAll(async (done) => {
  await db.connectt();
  done();
}, TIME);

describe("Device-info test", () => {
  let userId;
  beforeAll(async (done) => {
    const v: UserI = {
      name: "Preet",
      password: "Preet123",
      email: "preetsc277@gmail.com",
    };
    const res = await request(app).post("/api/u/login/create").send(v);
    console.log("ADD DEVICE USER", res.body);
    expect(res.body._id).toBeDefined();
    userId = res.body._id;
    done();
  }, TIME);

  test(
    "Add Device info - Successful",
    async (done) => {
      const dInfo = {
        user_id: userId,
        device_id: 1234,
        device_type: "mobile",
        model_no: " Nokia C2-03",
      };
      const res = await request(app).post("/api/u/device-info").send(dInfo);
      console.log("ADD DEVICE INFO", res.body);
      expect(res.status).toEqual(201);
      done();
    },
    TIME
  );

  test(
    "Add Device info - Only ID",
    async (done) => {
      const dInfo = {
        user_id: userId,
      };
      const res = await request(app).post("/api/u/device-info").send(dInfo);
      expect(res.status).toEqual(201);
      done();
    },
    TIME
  );

  test(
    "Add Device info - No ID",
    async (done) => {
      const dInfo = {
        device_id: 1234,
        device_type: "mobile",
        model_no: " Nokia C2-03",
      };
      const res = await request(app).post("/api/u/device-info").send(dInfo);
      expect(res.status).toEqual(400);
      done();
    },
    TIME
  );

  test(
    "Add Device info - Invalid ID",
    async (done) => {
      const dInfo = {
        user_id: "5ef10106e9ed6829bc81cec9",
        device_id: 1234,
        device_type: "mobile",
        model_no: " Nokia C2-03",
      };
      const res = await request(app).post("/api/u/device-info").send(dInfo);
      expect(res.status).toEqual(400);
      done();
    },
    TIME
  );

  test(
    "Add Device info - Invalid ID Type",
    async (done) => {
      const dInfo = {
        user_id: "9876543210",
        device_id: 1234,
        device_type: "mobile",
        model_no: " Nokia C2-03",
      };
      const res = await request(app).post("/api/u/device-info").send(dInfo);
      expect(res.status).toEqual(500);
      done();
    },
    TIME
  );
});

afterAll(async (done) => {
  await db.disconnect();
  done();
});
