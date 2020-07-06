import validator from "validator";
import app from "../../app";
import * as request from "supertest";
import UserI from "../../interfaces/user.interface";
import * as db from "../../database";
import * as faker from "faker";

const TIME = 30000;
beforeAll(async (done) => {
  await db.connectt();
  done();
}, TIME);

describe("User Login/Signup test", () => {
  test(
    "User-Signup - Successful",
    async (done) => {
      const user: UserI = {
        name: "aman",
        email: "aman@gmail.com",
        password: "abc@123",
      };
      const res = await request(app).post("/api/u/login/create").send(user);
      console.log("LOGIN SUCCESSFUL", res.body);
      expect(validator.isMongoId(res.body._id)).toEqual(true);
      expect(res.status).toEqual(201);
      done();
    },
    TIME
  );

  test(
    "User-Signup - Redundant Email",
    async (done) => {
      const user: UserI = {
        name: "aman",
        email: "aman@gmail.com",
        password: "abc@123",
      };
      const res = await request(app).post("/api/u/login/create").send(user);
      expect(res.status).toEqual(400);
      done();
    },
    TIME
  );

  test(
    "User-Signup - Invalid Email",
    async (done) => {
      const user: UserI = {
        name: "aman",
        email: "amangmail.com",
        password: "abc@123",
      };
      const res = await request(app).post("/api/u/login/create").send(user);
      expect(res.status).toEqual(400);
      done();
    },
    TIME
  );

  test(
    "User-Signup - Invalid name",
    async (done) => {
      const user: UserI = {
        name: "a@13",
        email: faker.internet.email(),
        password: "abc@123",
      };
      const res = await request(app).post("/api/u/login/create").send(user);
      expect(res.status).toEqual(400);
      done();
    },
    TIME
  );

  test(
    "User-Signup - Invalid name (short)",
    async (done) => {
      const user: UserI = {
        name: "am",
        email: faker.internet.email(),
        password: "abc@123",
      };
      const res = await request(app).post("/api/u/login/create").send(user);
      expect(res.status).toEqual(400);
      done();
    },
    TIME
  );

  test(
    "User-Signup - Invalid Password (short)",
    async (done) => {
      const user: UserI = {
        name: "aman",
        email: "aman@gmail.com",
        password: "a123",
      };
      const res = await request(app).post("/api/u/login/create").send(user);
      expect(res.status).toEqual(400);
      done();
    },
    TIME
  );

  test(
    "User-Signup - Invalid Password (spaces)",
    async (done) => {
      const user: UserI = {
        name: "aman",
        email: "aman@gmail.com",
        password: "     abc   ",
      };
      const res = await request(app).post("/api/u/login/create").send(user);
      expect(res.status).toEqual(400);
      done();
    },
    TIME
  );

  test(
    "User-Login - Successful",
    async (done) => {
      const user = {
        email: "aman@gmail.com",
        password: "abc@123",
      };
      const res = await request(app).post("/api/u/login/").send(user);
      expect(res.status).toEqual(200);
      expect(validator.isJWT(res.body.token)).toEqual(true);
      done();
    },
    TIME
  );

  test(
    "User-Login - Invalid Email",
    async (done) => {
      const user = {
        email: "amangmail.com",
        password: "abc@123",
      };
      const res = await request(app).post("/api/u/login/").send(user);
      expect(res.status).toEqual(400);
      done();
    },
    TIME
  );

  test(
    "User-Login - Invalid Password (short)",
    async (done) => {
      const user = {
        email: "aman@gmail.com",
        password: "a123",
      };
      const res = await request(app).post("/api/u/login/").send(user);
      expect(res.status).toEqual(400);
      done();
    },
    TIME
  );

  test(
    "User-Login - Invalid Password (spaces)",
    async (done) => {
      const user = {
        email: "aman@gmail.com",
        password: " a bc   ",
      };
      const res = await request(app).post("/api/u/login/").send(user);
      expect(res.status).toEqual(400);
      done();
    },
    TIME
  );
});

afterAll(async (done) => {
  await db.disconnect();
  done();
});
