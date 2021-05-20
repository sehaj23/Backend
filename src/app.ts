import * as aws from "aws-sdk";
import * as compression from 'compression';
import * as cors from "cors";
import * as dotenv from "dotenv";
import * as express from "express";
import * as http from 'http';
import * as https from 'https';
import * as morgan from "morgan";
import * as multer from "multer";
import * as multerS3 from "multer-s3";
import BookingController from "./controller/booking.controller";
import './cron-jobs/index.cron-job';
import job2 from "./cron-jobs/index.cron-job";
import { RefundTypeEnum } from "./interfaces/refund.interface";
import Booking from "./models/booking.model";
import Cart from "./models/cart.model";
import MongoCounter from "./models/mongo-counter.model";
import Referral from "./models/referral.model";
import Refund from "./models/refund.model";
import Salon from "./models/salon.model";
import redisClient from './redis/redis';
import router from "./routes/AdminRoutes/index.routes";
import MicroserviceAuth from "./routes/MicroserviceAuth";
import Userrouter from "./routes/UserRoutes/index.routes";
import VendorApprouter from "./routes/VendorAppRoutes/index.routes";
import Vendorrouter from "./routes/VendorRoutes/index.routes";
import BookingService from "./service/booking.service";
import CartService from "./service/cart.service";
import MongoCounterService from "./service/mongo-counter.service";
import RazorPayService from "./service/razorpay.service";
import ReferralService from "./service/referral.service";
import RefundService from "./service/refund.service";
import startSocketIO from "./service/socketio";
import ErrorResponse from "./utils/error-response";
import logger from "./utils/logger";
var bodyParser = require('body-parser')
const swaggerUi = require('swagger-ui-express');
import swaggerJsdoc = require('swagger-jsdoc');
import runAllCrons from "./cron-jobs/index.cron-job";
import AdminApprouter from "./routes/AdminAppRoutes/index.router";

const basicAuth = require('express-basic-auth')

dotenv.config();


const app = express();
if (process.env.NODE_ENV !== 'production') {
  const apiPath = (process.env.NODE_ENV === 'development') ? './dist/routes/**/*.js' : './src/routes/**/*.ts'
  const options = {
    swaggerDefinition: {
      openapi: '3.0.1',
      info: {
        title: 'Zattire APIs',
        version: '1.0.0',
      },
      servers: [
        {
          url: "http://localhost:8082"
        },
        {
          url: "https://devbackend.zattire.com/"
        }
      ],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          }
        },
      },
      security: [{
        bearerAuth: []
      }],
    },
    swaggerOptions: {
      displayRequestDuration: true,
    },
    apis: [apiPath],
  };

  const swaggerSpec = swaggerJsdoc(options);
  app.use('/api-docs', basicAuth({
    users: { 'coder': 'HumbelCoders_@!' },
    challenge: true,
  }), swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    explorer: true,
    swaggerOptions: {
      displayRequestDuration: true,
    },
  }));
}

export const httpApp = http.createServer(app);
http.globalAgent.maxSockets = Infinity;
https.globalAgent.maxSockets = Infinity;

app.use(compression())
app.use(bodyParser({ limit: '50mb' }));
app.use(cors({
  origin: ['https://vendors.zattire.com', 'https://dev-vendor.zattire.com', 'http://localhost:3000', 'https://yumyam.zattire.com', 'https://prod-yamyum.zattire.com', 'https://dev2-vendor.zattire.com', "https://prodyum.zattire.com", "https://devyum.zattire.com", "http://localhost:59688"],
  credentials: true
}));

export const io: SocketIO.Server = require("socket.io")(httpApp);
startSocketIO(io)

const URL_PREFIX = '/main-server'

const s3 = new aws.S3();

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: "zattire-images/all-images",
    acl: "public-read",
    key: function (request, file, cb) {
      console.log(file);
      cb(null, `images/${Date.now()}_${file.originalname}`);
    },
  }),
}).array("upload", 1);
app.post(`${URL_PREFIX}/upload`, function (request, response, next) {
  upload(request, response, function (error) {
    if (error) {
      console.log(error);
      return response.send(`/error/${error}`);
    }
    const location = request.files[0].location
    response.send({
      location,
      success: true
    });
  });
});

// setup the logger
app.use(
  morgan(
    //@ts-ignore
    ":remote-addr - :method :url :status - :response-time ms",
    { stream: logger.stream }
  )
);

app.use(express.json());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");

  next();
});
app.use(`${URL_PREFIX}/api`, router);
app.use(`${URL_PREFIX}/api/v`, Vendorrouter)
app.use(`${URL_PREFIX}/api/u`, Userrouter)
app.use(`${URL_PREFIX}/api/vendorapp`, VendorApprouter)
app.use(`${URL_PREFIX}/api/adminapp`, AdminApprouter)
app.use(`${URL_PREFIX}`, MicroserviceAuth)
console.log("running all crons")
runAllCrons()

// TEMP: to clear redis
app.get(`${URL_PREFIX}/r/clr`, async (req: express.Request, res: express.Response) => {
  try {
    redisClient.flushdb();
    res.status(200).send({ msg: 'Redis store cleared' })
  } catch (e) {
    res.status(400).send(e)
  }
})

app.get(`${URL_PREFIX}`, (req, res) => {

  res.send(`Hello!  Welcome to Zattire's ${process.env.NODE_ENV} main-servers.`)
})

app.get("/r", async (req, res) => {
  try {
    const rp = new RazorPayService()
    const paymentId = "pay_GzHgEN0TjYAqGD"
    const rpFetch = await rp.fetch(paymentId)
    // res.send(rpFetch)
    // return
    const cartService = new CartService(Cart, Salon)
    const mongoCounterService = new MongoCounterService(MongoCounter)
    const referralService = new ReferralService(Referral)
    const bookingService = new BookingService(Booking, Salon, cartService, mongoCounterService, Referral)
    const rs = new RefundService(Refund, bookingService)
    const bookingId = "60787be91ca9ea0012e96f19"
    const booking = await bookingService.getOne({ _id: bookingId })
    if (!booking) throw new ErrorResponse({ message: "Booking not found" })
    const totalAmount = BookingController.getRazorPayPayableAmount(booking)
    // const o = await rp.capture(paymentId, totalAmount)
    // console.log(o)
    const out = await rs.createRefund(RefundTypeEnum.Normal_RazorPay, bookingId, "5f967784b2c7e747126eaf2f")
    res.send(out)
  } catch (e) {
    res.status(400).send(e.message)
  }
})

// this is for 404
app.use(function (req, res, next) {
  var err = new Error("Not Found");
  err.name = "404";
  res.status(404);
  res.send({
    message: `Page not found ${req.url} : ${req.baseUrl} : ${req.hostname}: ${req.ip}`,
  });
});


export default app

if (process.env.NODE_ENV === 'local') {
  //PrintRoutes()
}
