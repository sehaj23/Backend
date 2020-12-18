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
import redisClient from './redis/redis';
import router from "./routes/AdminRoutes/index.routes";
import Userrouter from "./routes/UserRoutes/index.routes";
import VendorApprouter from "./routes/VendorAppRoutes/index.routes";
import Vendorrouter from "./routes/VendorRoutes/index.routes";
import startSocketIO from "./service/socketio";
import logger from "./utils/logger";
import PrintRoutes from "./utils/print-routes";

dotenv.config();

const app = express();
export const httpApp = http.createServer(app);
http.globalAgent.maxSockets = Infinity;
https.globalAgent.maxSockets = Infinity;

app.use(compression())
app.use(cors({
  origin: ['https://vendor.zattire.com', 'https://dev-vendor.zattire.com', 'http://localhost:3000', 'https://yumyam.zattire.com', 'https://prod-yamyum.zattire.com'],
  credentials: true
}));

export const io: SocketIO.Server = require("socket.io")(httpApp);
startSocketIO(io)

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
app.post("/upload", function (request, response, next) {
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
    {stream: logger.stream}
  )
);

app.use(express.json());

app.use("/api", router);
app.use("/api/v", Vendorrouter)
app.use("/api/u", Userrouter)
app.use("/api/vendorapp",VendorApprouter)


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
  res.send(`Hello!  Welcome to Zattire's ${process.env.NODE_ENV} servers.`)  
})

// this is for 404
app.use(function (req, res, next) {
  var err = new Error("Not Found");
  err.name = "404";
  res.status(404);
  res.send(err);
});


export default app

if(process.env.NODE_ENV === 'local'){
  PrintRoutes()
}
