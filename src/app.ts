import * as aws from "aws-sdk";
import * as compression from 'compression';
import * as cors from "cors";
import * as dotenv from "dotenv";
import * as express from "express";
import * as http from 'http';
import * as https from 'https';
import * as morgan from "morgan";
import * as multer from "multer";
import multerS3 = require("multer-sharp-s3");
import './cron-jobs/index.cron-job';
import runAllCrons from "./cron-jobs/index.cron-job";
import redisClient from './redis/redis';
import AdminApprouter from "./routes/AdminAppRoutes/index.router";
import router from "./routes/AdminRoutes/index.routes";
import MicroserviceAuth from "./routes/MicroserviceAuth";
import Userrouter from "./routes/UserRoutes/index.routes";
import VendorApprouter from "./routes/VendorAppRoutes/index.routes";
import Vendorrouter from "./routes/VendorRoutes/index.routes";
import startSocketIO from "./service/socketio";
import logger from "./utils/logger";
var bodyParser = require('body-parser')
const basicAuth = require('express-basic-auth')

dotenv.config();
const app = express();
const urlPrefix = '/main-server'
const s3 = new aws.S3();

export const httpApp = http.createServer(app);
http.globalAgent.maxSockets = Infinity;
https.globalAgent.maxSockets = Infinity;

app.use(compression())
app.use(bodyParser({
  limit: '50mb',
  parameterLimit: 100000,
  extended: true
}))

app.use(cors({
  origin: [
    // react applications
    'https://vendors.zattire.com', 'https://dev-vendor.zattire.com', 
    'https://yumyam.zattire.com', 'https://prod-yamyum.zattire.com', 
    'https://dev2-vendor.zattire.com', "https://prodyum.zattire.com", "https://devyum.zattire.com", 
    // localhosts
    "http://localhost:59688", "http://localhost:55007/", 'http://localhost:3000',
    // zattire hosted sites
    "https://zattire-vendor-app.web.app", "https://app.zattire.com", "https://www.zattire.com", 
    "https://zattire.com", "https://zattire.com/home", "https://zattire-qr.web.app",
    // zatture dev website
    "https://zattire-vendor-app--dev-fno83aco.web.app"],
  credentials: true
}));

export const io: SocketIO.Server = require("socket.io")(httpApp);
startSocketIO(io)

const upload = multer({
  storage: multerS3({
    s3: s3,
    Bucket: "zattire-images/all-images",
    ACL: "public-read",
    Key: function (request, file, cb) {
      cb(null, `images/${Date.now()}_${file.originalname}`);
    },
  }),
}).array("upload", 1);

app.post(`${urlPrefix}/upload`, function (request, response, next) {
  upload(request, response, function (error) {
    if (error) {
      return response.send(`/error/${error}`);
    }
    const location = request.files[0].Location
    response.send({
      location,
      success: true
    });
  });
});

app.use(morgan(
  //@ts-ignore
  ":remote-addr - :method :url :status - :response-time ms",
  { stream: logger.stream }
));

app.use(express.json());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

app.use(`${urlPrefix}/api`, router);
app.use(`${urlPrefix}/api/v`, Vendorrouter)
app.use(`${urlPrefix}/api/u`, Userrouter)
app.use(`${urlPrefix}/api/vendorapp`, VendorApprouter)
app.use(`${urlPrefix}/api/adminapp`, AdminApprouter)
app.use(`${urlPrefix}`, MicroserviceAuth)
runAllCrons()

app.get(`${urlPrefix}/r/clr`, async (req: express.Request, res: express.Response) => {
  try {
    redisClient.flushdb();
    res.status(200).send({ msg: 'Redis store  Cleared  ' })
  } catch (e) {
    res.status(400).send(e)
  }
})

app.get(`${urlPrefix}`, (req, res) => {
  res.status(200).send({
    message: 'running',
    node_env: process.env.NODE_ENV,
    prefix: urlPrefix
  })
})

app.get("/", (req, res) => {
  res.status(200).send({ message: 'running' })
})

app.use(function (req, res, next) {
  res.status(404).send({
    message: `Page not found`,
    url: req.url,
    baseUrl: req.baseUrl,
    hostname: req.hostname,
    ip: req.ip
  });
});

export default app


// if (process.env.NODE_ENV !== 'production') {
//   const apiPath = (process.env.NODE_ENV === 'development') ? './dist/routes/**/*.js' : './src/routes/**/*.ts'
// const options = {
//   swaggerDefinition: {
//     openapi: '3.0.1',
//     info: {
//       title: 'Zattire APIs',
//       version: '1.0.0',
//     },
//     servers: [
//       {
//         url: "http://localhost:8082"
//       },
//       {
//         url: "https://devbackend.zattire.com/"
//       }
//     ],
//     components: {
//       securitySchemes: {
//         bearerAuth: {
//           type: 'http',
//           scheme: 'bearer',
//           bearerFormat: 'JWT',
//         }
//       },
//     },
//     security: [{
//       bearerAuth: []
//     }],
//   },
//   swaggerOptions: {
//     displayRequestDuration: true,
//   },
//   apis: [apiPath],
// };

// const swaggerSpec = swaggerJsdoc(options);
// app.use('/api-docs', basicAuth({
//   users: { 'coder': 'HumbelCoders_@!' },
//   challenge: true,
// }), swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
//   explorer: true,
//   swaggerOptions: {
//     displayRequestDuration: true,
//   },
// }));
// }
