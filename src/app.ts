import * as aws from "aws-sdk";
import * as compression from 'compression';
import * as cors from "cors";
import * as dotenv from "dotenv";
import * as express from "express";
import * as fs from "fs";
import * as http from 'http';
import * as https from 'https';
import * as morgan from "morgan";
import * as multer from "multer";
import * as multerS3 from "multer-s3";
import redisClient from './redis/redis';
import router from "./routes/AdminRoutes/index.routes";
import Userrouter from "./routes/UserRoutes/index.routes";
import VendorApprouter from "./routes/VendorAppRoutes/index.routes";
import Vendorrouter from "./routes/VendorRoutes/index.routes";
import startSocketIO from "./service/socketio";
import logger from "./utils/logger";

const app = express();
export const httpApp = http.createServer(app);
http.globalAgent.maxSockets = Infinity;
https.globalAgent.maxSockets = Infinity;

app.use(compression())
app.use(cors({
  origin: ['https://vendor.zattire.com', 'https://dev-vendor.zattire.com', 'http://localhost:3000'],
  credentials: true
}));


export const io: SocketIO.Server = require("socket.io")(httpApp);

startSocketIO(io)



const spacesEndpoint = new aws.Endpoint("nyc3.digitaloceanspaces.com");
const s3 = new aws.S3({
  //@ts-ignore
  endpoint: spacesEndpoint,
  accessKeyId: "DQC6AT6WECGTVTPBMEPW",
  secretAccessKey: "1aG2MQPG1CBJS01q/y6pjLwRVNgzPwfkNkvWa3XCrp8",
});

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: "zattire",
    acl: "public-read",
    key: function (request, file, cb) {
      console.log(file);
      cb(null, `images/${Date.now()}_${file.originalname}`);
    },
  }),
}).array("upload", 1);


// TODO : Change to AWS  
app.post("/upload", function (request, response, next) {
  upload(request, response, function (error) {
    if (error) {
      console.log(error);
      return response.send(`/error/${error}`);
    }
    console.log("File uploaded successfully.");
    const location = request.files[0].location
    response.send({
      location,
      success: true
    });
  });
});


dotenv.config();

const accessLogStream = fs.createWriteStream("access.log", { flags: "a" });


// setup the logger
// app.use(morgan('combined', { stream: accessLogStream }))
app.use(
  morgan(
    //@ts-ignore
    ":remote-addr - :method :url :status - :response-time ms",
    {stream: logger.stream}
  )
);

app.use(express.json());

app.use("/api", router);
app.use("/api/v", Vendorrouter)
app.use("/api/u", Userrouter)
app.use("/api/vendorapp",VendorApprouter)

// app.get("/r", async (req: express.Request, res: express.Response) => {
//   const data = await UserRedis.set("user", "{hello: 'world'}")
//   res.send(`Hey ${data}`)
// })

// app.get("/r/g", async (req: express.Request, res: express.Response) => {
//   const data = await UserRedis.get("user")
//   res.send(`Hey ${data}`)
// })

// app.get("/r/r", async (req: express.Request, res: express.Response) => {
//   const data = await UserRedis.removeAll()
//   res.send(`Hey ${data}`)
// })



// TEMP: to clear redis
app.get("/r/clr", async (req: express.Request, res: express.Response) => {
  try {
    redisClient.flushdb();
    res.status(200).send({ msg: 'Redis store cleared' })
  } catch (e) {
    res.status(400).send(e)
  }
})


app.get("/", (req, res) => {
  res.send(`Welcome to Zattire's ${process.env.NODE_ENV} servers.`)  
})

// this is for 404
app.use(function (req, res, next) {
  var err = new Error("Not Found");
  err.name = "404";
  res.status(404);
  res.send(err);
});


export default app
