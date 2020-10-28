import * as express from "express";
import * as bobyParser from "body-parser";
import * as morgan from "morgan";
import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";
import router from "./routes/AdminRoutes/index.routes";
import Vendorrouter from "./routes/VendorRoutes/index.routes"
import Userrouter from "./routes/UserRoutes/index.routes"
import VendorApprouter from "./routes/VendorAppRoutes/index.routes"
import * as aws from "aws-sdk";
import * as multer from "multer";
import * as multerS3 from "multer-s3";
import NewVendor from "./models/newVendor.model";
import logger from "./utils/logger";
import * as cors from "cors";
import startSocketIO from "./service/socketio";
import { AdminRedis } from "./redis/index.redis";
import redisClient from './redis/redis'
import Vendor from "./models/vendor.model";
import encryptData from "./utils/password-hash";
import { VendorI } from "./interfaces/vendor.interface";
import OtpService from "./service/otp.service";
import MongoCounterService from "./service/mongo-counter.service";
import MongoCounter from "./models/mongo-counter.model";
import { MongoCounterI } from "./interfaces/mongo-counter.interface";

const app = express();
app.use(cors({
  origin: ['https://vendor.zattire.com', 'http://localhost:3000'],
  credentials: true
}));

export const http = require('http').createServer(app);

export const io: SocketIO.Server = require("socket.io")(http);

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
    ":remote-addr - :method :url :status :res[content-length] - :response-time ms"
  )
);

app.use(express.json());

app.use("/api", router);
app.use("/api/v", Vendorrouter)
app.use("/api/u", Userrouter)
app.use("/api/vendorapp",VendorApprouter)
app.get(
  "/app/get-vendor",
  async (req: express.Request, res: express.Response) => {
    try {
      const nv = await NewVendor.find();
      res.send(nv);
    } catch (e) {
      logger.error(e.message);
      res.status(403);
      res.send({ error: e.message });
    }
  }
);

app.get("/cv",
  async (req: express.Request, res: express.Response) => {
    try {

      const vendor: VendorI = {
        name: "Preet",
        email: "preet@gmail.com",
        password: encryptData("preet123"),
        contact_number: "1234567890",
      };
      const v = await Vendor.create(vendor)
      console.log(v)
      res.send(v)
    } catch (e) {
      logger.error(e.message);
      res.status(403);
      res.send({ error: e.message });
    }
  }
);


const adminId = "5efa3d3af9212b04a31b5d33"
// app.get("/r/s/:id", async (req: express.Request, res: express.Response) => {
//   try{  
//     const id = req.params.id || adminId
//     const ar: string =  await AdminRedis.get(id, "dnasn")
//     console.log(ar)
//     if(ar !== null){
//       return res.send(JSON.parse(ar))
//     }
//   }

// );

app.put(
  "/update-vendor/:id",
  async (req: express.Request, res: express.Response) => {
    const _id = req.params.id;

    try {
      const nv = await NewVendor.update({ _id }, req.body);
      res.send(nv);
    } catch (e) {
      logger.error(e.message);
      res.status(403);
      res.send({ error: e.message });
    }
  }
);

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
  var params = {
    Destination: { /* required */
      ToAddresses: [
        'preetsc27@gmail.com',
        /* more items */
      ]
    },
    Message: { /* required */
      Body: { /* required */
        Html: {
         Charset: "UTF-8",
         Data: `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional //EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

         <html xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:v="urn:schemas-microsoft-com:vml">
         <head>
         <!--[if gte mso 9]><xml><o:OfficeDocumentSettings><o:AllowPNG/><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml><![endif]-->
         <meta content="text/html; charset=utf-8" http-equiv="Content-Type"/>
         <meta content="width=device-width" name="viewport"/>
         <!--[if !mso]><!-->
         <meta content="IE=edge" http-equiv="X-UA-Compatible"/>
         <!--<![endif]-->
         <title></title>
         <!--[if !mso]><!-->
         <link href="https://fonts.googleapis.com/css?family=Montserrat" rel="stylesheet" type="text/css"/>
         <!--<![endif]-->
         <style type="text/css">
             body {
               margin: 0;
               padding: 0;
             }
         
             table,
             td,
             tr {
               vertical-align: top;
               border-collapse: collapse;
             }
         
             * {
               line-height: inherit;
             }
         
             a[x-apple-data-detectors=true] {
               color: inherit !important;
               text-decoration: none !important;
             }
           </style>
         <style id="media-query" type="text/css">
             @media (max-width: 875px) {
         
               .block-grid,
               .col {
                 min-width: 320px !important;
                 max-width: 100% !important;
                 display: block !important;
               }
         
               .block-grid {
                 width: 100% !important;
               }
         
               .col {
                 width: 100% !important;
               }
         
               .col>div {
                 margin: 0 auto;
               }
         
               img.fullwidth,
               img.fullwidthOnMobile {
                 max-width: 100% !important;
               }
         
               .no-stack .col {
                 min-width: 0 !important;
                 display: table-cell !important;
               }
         
               .no-stack.two-up .col {
                 width: 50% !important;
               }
         
               .no-stack .col.num2 {
                 width: 16.6% !important;
               }
         
               .no-stack .col.num3 {
                 width: 25% !important;
               }
         
               .no-stack .col.num4 {
                 width: 33% !important;
               }
         
               .no-stack .col.num5 {
                 width: 41.6% !important;
               }
         
               .no-stack .col.num6 {
                 width: 50% !important;
               }
         
               .no-stack .col.num7 {
                 width: 58.3% !important;
               }
         
               .no-stack .col.num8 {
                 width: 66.6% !important;
               }
         
               .no-stack .col.num9 {
                 width: 75% !important;
               }
         
               .no-stack .col.num10 {
                 width: 83.3% !important;
               }
         
               .video-block {
                 max-width: none !important;
               }
         
               .mobile_hide {
                 min-height: 0px;
                 max-height: 0px;
                 max-width: 0px;
                 display: none;
                 overflow: hidden;
                 font-size: 0px;
               }
         
               .desktop_hide {
                 display: block !important;
                 max-height: none !important;
               }
             }
           </style>
         </head>
         <body class="clean-body" style="margin: 0; padding: 0; -webkit-text-size-adjust: 100%; background-color: transparent;">
         <!--[if IE]><div class="ie-browser"><![endif]-->
         <table bgcolor="transparent" cellpadding="0" cellspacing="0" class="nl-container" role="presentation" style="table-layout: fixed; vertical-align: top; min-width: 320px; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: transparent; width: 100%;" valign="top" width="100%">
         <tbody>
         <tr style="vertical-align: top;" valign="top">
         <td style="word-break: break-word; vertical-align: top;" valign="top">
         <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td align="center" style="background-color:transparent"><![endif]-->
         <div style="background-color:transparent;overflow:hidden">
         <div class="block-grid" style="min-width: 320px; max-width: 855px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; Margin: 0 auto; width: 100%; background-color: transparent;">
         <div style="border-collapse: collapse;display: table;width: 100%;background-color:transparent;background-image:url('images/bgnl.png');background-position:center top;background-repeat:no-repeat">
         <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:transparent;"><tr><td align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:855px"><tr class="layout-full-width" style="background-color:transparent"><![endif]-->
         <!--[if (mso)|(IE)]><td align="center" width="855" style="background-color:transparent;width:855px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px; padding-top:5px; padding-bottom:5px;"><![endif]-->
         <div class="col num12" style="min-width: 320px; max-width: 855px; display: table-cell; vertical-align: top; width: 855px;">
         <div style="width:100% !important;">
         <!--[if (!mso)&(!IE)]><!-->
         <div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:5px; padding-bottom:5px; padding-right: 0px; padding-left: 0px;">
         <!--<![endif]-->
         <table border="0" cellpadding="0" cellspacing="0" class="divider" role="presentation" style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;" valign="top" width="100%">
         <tbody>
         <tr style="vertical-align: top;" valign="top">
         <td class="divider_inner" style="word-break: break-word; vertical-align: top; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; padding-top: 10px; padding-right: 10px; padding-bottom: 10px; padding-left: 10px;" valign="top">
         <table align="center" border="0" cellpadding="0" cellspacing="0" class="divider_content" height="30" role="presentation" style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-top: 30px solid transparent; height: 30px; width: 100%;" valign="top" width="100%">
         <tbody>
         <tr style="vertical-align: top;" valign="top">
         <td height="30" style="word-break: break-word; vertical-align: top; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;" valign="top"><span></span></td>
         </tr>
         </tbody>
         </table>
         </td>
         </tr>
         </tbody>
         </table>
         <table border="0" cellpadding="0" cellspacing="0" class="divider" role="presentation" style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;" valign="top" width="100%">
         <tbody>
         <tr style="vertical-align: top;" valign="top">
         <td class="divider_inner" style="word-break: break-word; vertical-align: top; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; padding-top: 10px; padding-right: 10px; padding-bottom: 10px; padding-left: 10px;" valign="top">
         <table align="center" border="0" cellpadding="0" cellspacing="0" class="divider_content" height="30" role="presentation" style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-top: 30px solid transparent; height: 30px; width: 100%;" valign="top" width="100%">
         <tbody>
         <tr style="vertical-align: top;" valign="top">
         <td height="30" style="word-break: break-word; vertical-align: top; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;" valign="top"><span></span></td>
         </tr>
         </tbody>
         </table>
         </td>
         </tr>
         </tbody>
         </table>
         <table border="0" cellpadding="0" cellspacing="0" class="divider" role="presentation" style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;" valign="top" width="100%">
         <tbody>
         <tr style="vertical-align: top;" valign="top">
         <td class="divider_inner" style="word-break: break-word; vertical-align: top; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; padding-top: 10px; padding-right: 10px; padding-bottom: 10px; padding-left: 10px;" valign="top">
         <table align="center" border="0" cellpadding="0" cellspacing="0" class="divider_content" height="30" role="presentation" style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-top: 30px solid transparent; height: 30px; width: 100%;" valign="top" width="100%">
         <tbody>
         <tr style="vertical-align: top;" valign="top">
         <td height="30" style="word-break: break-word; vertical-align: top; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;" valign="top"><span></span></td>
         </tr>
         </tbody>
         </table>
         </td>
         </tr>
         </tbody>
         </table>
         <table border="0" cellpadding="0" cellspacing="0" class="divider" role="presentation" style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;" valign="top" width="100%">
         <tbody>
         <tr style="vertical-align: top;" valign="top">
         <td class="divider_inner" style="word-break: break-word; vertical-align: top; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; padding-top: 10px; padding-right: 10px; padding-bottom: 10px; padding-left: 10px;" valign="top">
         <table align="center" border="0" cellpadding="0" cellspacing="0" class="divider_content" height="30" role="presentation" style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-top: 30px solid transparent; height: 30px; width: 100%;" valign="top" width="100%">
         <tbody>
         <tr style="vertical-align: top;" valign="top">
         <td height="30" style="word-break: break-word; vertical-align: top; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;" valign="top"><span></span></td>
         </tr>
         </tbody>
         </table>
         </td>
         </tr>
         </tbody>
         </table>
         <table border="0" cellpadding="0" cellspacing="0" class="divider" role="presentation" style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;" valign="top" width="100%">
         <tbody>
         <tr style="vertical-align: top;" valign="top">
         <td class="divider_inner" style="word-break: break-word; vertical-align: top; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; padding-top: 10px; padding-right: 10px; padding-bottom: 10px; padding-left: 10px;" valign="top">
         <table align="center" border="0" cellpadding="0" cellspacing="0" class="divider_content" height="30" role="presentation" style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-top: 30px solid transparent; height: 30px; width: 100%;" valign="top" width="100%">
         <tbody>
         <tr style="vertical-align: top;" valign="top">
         <td height="30" style="word-break: break-word; vertical-align: top; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;" valign="top"><span></span></td>
         </tr>
         </tbody>
         </table>
         </td>
         </tr>
         </tbody>
         </table>
         <div align="center" class="img-container center fixedwidth" style="padding-right: 0px;padding-left: 5px;">
         <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr style="line-height:0px"><td style="padding-right: 0px;padding-left: 5px;" align="center"><![endif]--><img align="center" alt="Alternate text" border="0" class="center fixedwidth" src="images/nl10.png" style="text-decoration: none; -ms-interpolation-mode: bicubic; height: auto; border: 0; width: 100%; max-width: 855px; display: block;" title="Alternate text" width="855"/>
         <!--[if mso]></td></tr></table><![endif]-->
         </div>
         <table border="0" cellpadding="0" cellspacing="0" class="divider" role="presentation" style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;" valign="top" width="100%">
         <tbody>
         <tr style="vertical-align: top;" valign="top">
         <td class="divider_inner" style="word-break: break-word; vertical-align: top; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; padding-top: 10px; padding-right: 0px; padding-bottom: 10px; padding-left: 0px;" valign="top">
         <table align="center" border="0" cellpadding="0" cellspacing="0" class="divider_content" role="presentation" style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-top: 1px solid #BBBBBB; width: 65%;" valign="top" width="65%">
         <tbody>
         <tr style="vertical-align: top;" valign="top">
         <td style="word-break: break-word; vertical-align: top; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;" valign="top"><span></span></td>
         </tr>
         </tbody>
         </table>
         </td>
         </tr>
         </tbody>
         </table>
         <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 20px; padding-left: 60px; padding-top: 20px; padding-bottom: 20px; font-family: 'Trebuchet MS', Tahoma, sans-serif"><![endif]-->
         <div style="color:#555555;font-family:'Montserrat', 'Trebuchet MS', 'Lucida Grande', 'Lucida Sans Unicode', 'Lucida Sans', Tahoma, sans-serif;line-height:1.5;padding-top:20px;padding-right:20px;padding-bottom:20px;padding-left:60px;">
         <div style="line-height: 1.5; font-size: 12px; font-family: 'Montserrat', 'Trebuchet MS', 'Lucida Grande', 'Lucida Sans Unicode', 'Lucida Sans', Tahoma, sans-serif; color: #555555; mso-line-height-alt: 18px;">
         <p style="font-size: 16px; line-height: 1.5; font-family: Montserrat, 'Trebuchet MS', 'Lucida Grande', 'Lucida Sans Unicode', 'Lucida Sans', Tahoma, sans-serif; word-break: break-word; mso-line-height-alt: 24px; margin: 0;"><span style="font-size: 16px;">                      Hi [Salon name],</span><br/><span style="font-size: 16px;">                      Your booking with [Customer name] is confirmed. yay!</span></p>
         </div>
         </div>
         <!--[if mso]></td></tr></table><![endif]-->
         <!--[if (!mso)&(!IE)]><!-->
         </div>
         <!--<![endif]-->
         </div>
         </div>
         <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
         <!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->
         </div>
         </div>
         </div>
         <div style="background-image:url('images/8e1e67be-df46-4142-bab1-17ee11dd1160.png');background-position:center top;background-repeat:no-repeat;background-color:transparent;overflow:hidden">
         <div class="block-grid three-up" style="min-width: 320px; max-width: 855px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; Margin: 0 auto; width: 100%; background-color: transparent;">
         <div style="border-collapse: collapse;display: table;width: 100%;background-color:transparent;">
         <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-image:url('images/8e1e67be-df46-4142-bab1-17ee11dd1160.png');background-position:center top;background-repeat:no-repeat;background-color:transparent;"><tr><td align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:855px"><tr class="layout-full-width" style="background-color:transparent"><![endif]-->
         <!--[if (mso)|(IE)]><td align="center" width="213" style="background-color:transparent;width:213px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px; padding-top:5px; padding-bottom:5px;"><![endif]-->
         <div class="col num3" style="display: table-cell; vertical-align: top; max-width: 320px; min-width: 213px; width: 213px;">
         <div style="width:100% !important;">
         <!--[if (!mso)&(!IE)]><!-->
         <div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:5px; padding-bottom:5px; padding-right: 0px; padding-left: 0px;">
         <!--<![endif]-->
         <div></div>
         <!--[if (!mso)&(!IE)]><!-->
         </div>
         <!--<![endif]-->
         </div>
         </div>
         <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
         <!--[if (mso)|(IE)]></td><td align="center" width="427" style="background-color:transparent;width:427px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px; padding-top:5px; padding-bottom:5px;"><![endif]-->
         <div class="col num6" style="display: table-cell; vertical-align: top; max-width: 320px; min-width: 426px; width: 427px;">
         <div style="width:100% !important;">
         <!--[if (!mso)&(!IE)]><!-->
         <div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:5px; padding-bottom:5px; padding-right: 0px; padding-left: 0px;">
         <!--<![endif]-->
         <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 20px; padding-left: 20px; padding-top: 20px; padding-bottom: 20px; font-family: 'Trebuchet MS', Tahoma, sans-serif"><![endif]-->
         <div style="color:#555555;font-family:'Montserrat', 'Trebuchet MS', 'Lucida Grande', 'Lucida Sans Unicode', 'Lucida Sans', Tahoma, sans-serif;line-height:1.5;padding-top:20px;padding-right:20px;padding-bottom:20px;padding-left:20px;">
         <div style="line-height: 1.5; font-size: 12px; font-family: 'Montserrat', 'Trebuchet MS', 'Lucida Grande', 'Lucida Sans Unicode', 'Lucida Sans', Tahoma, sans-serif; color: #555555; mso-line-height-alt: 18px;">
         <p style="font-size: 18px; line-height: 1.5; word-break: break-word; text-align: center; font-family: Montserrat, 'Trebuchet MS', 'Lucida Grande', 'Lucida Sans Unicode', 'Lucida Sans', Tahoma, sans-serif; mso-line-height-alt: 27px; margin: 0;"><span style="font-size: 18px;"><strong>Appointment ID:</strong></span></p>
         <p style="font-size: 18px; line-height: 1.5; word-break: break-word; text-align: center; font-family: Montserrat, 'Trebuchet MS', 'Lucida Grande', 'Lucida Sans Unicode', 'Lucida Sans', Tahoma, sans-serif; mso-line-height-alt: 27px; margin: 0;"><span style="font-size: 18px;"><strong>[.............]</strong></span></p>
         </div>
         </div>
         <!--[if mso]></td></tr></table><![endif]-->
         <table border="0" cellpadding="0" cellspacing="0" class="divider" role="presentation" style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;" valign="top" width="100%">
         <tbody>
         <tr style="vertical-align: top;" valign="top">
         <td class="divider_inner" style="word-break: break-word; vertical-align: top; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; padding-top: 10px; padding-right: 10px; padding-bottom: 10px; padding-left: 10px;" valign="top">
         <table align="center" border="0" cellpadding="0" cellspacing="0" class="divider_content" role="presentation" style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-top: 1px solid #BBBBBB; width: 100%;" valign="top" width="100%">
         <tbody>
         <tr style="vertical-align: top;" valign="top">
         <td style="word-break: break-word; vertical-align: top; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;" valign="top"><span></span></td>
         </tr>
         </tbody>
         </table>
         </td>
         </tr>
         </tbody>
         </table>
         <!--[if (!mso)&(!IE)]><!-->
         </div>
         <!--<![endif]-->
         </div>
         </div>
         <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
         <!--[if (mso)|(IE)]></td><td align="center" width="213" style="background-color:transparent;width:213px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px; padding-top:5px; padding-bottom:5px;"><![endif]-->
         <div class="col num3" style="display: table-cell; vertical-align: top; max-width: 320px; min-width: 213px; width: 213px;">
         <div style="width:100% !important;">
         <!--[if (!mso)&(!IE)]><!-->
         <div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:5px; padding-bottom:5px; padding-right: 0px; padding-left: 0px;">
         <!--<![endif]-->
         <div></div>
         <!--[if (!mso)&(!IE)]><!-->
         </div>
         <!--<![endif]-->
         </div>
         </div>
         <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
         <!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->
         </div>
         </div>
         </div>
         <div style="background-image:url('images/8e1e67be-df46-4142-bab1-17ee11dd1160.png');background-position:center top;background-repeat:no-repeat;background-color:transparent;overflow:hidden">
         <div class="block-grid three-up no-stack" style="min-width: 320px; max-width: 855px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; Margin: 0 auto; width: 100%; background-color: transparent;">
         <div style="border-collapse: collapse;display: table;width: 100%;background-color:transparent;">
         <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-image:url('images/8e1e67be-df46-4142-bab1-17ee11dd1160.png');background-position:center top;background-repeat:no-repeat;background-color:transparent;"><tr><td align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:855px"><tr class="layout-full-width" style="background-color:transparent"><![endif]-->
         <!--[if (mso)|(IE)]><td align="center" width="213" style="background-color:transparent;width:213px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px; padding-top:5px; padding-bottom:5px;"><![endif]-->
         <div class="col num3" style="display: table-cell; vertical-align: top; max-width: 320px; min-width: 213px; width: 213px;">
         <div style="width:100% !important;">
         <!--[if (!mso)&(!IE)]><!-->
         <div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:5px; padding-bottom:5px; padding-right: 0px; padding-left: 0px;">
         <!--<![endif]-->
         <div></div>
         <!--[if (!mso)&(!IE)]><!-->
         </div>
         <!--<![endif]-->
         </div>
         </div>
         <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
         <!--[if (mso)|(IE)]></td><td align="center" width="427" style="background-color:transparent;width:427px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px; padding-top:5px; padding-bottom:5px;"><![endif]-->
         <div class="col num6" style="display: table-cell; vertical-align: top; max-width: 320px; min-width: 426px; width: 427px;">
         <div style="width:100% !important;">
         <!--[if (!mso)&(!IE)]><!-->
         <div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:5px; padding-bottom:5px; padding-right: 0px; padding-left: 0px;">
         <!--<![endif]-->
         <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 15px; padding-left: 40px; padding-top: 15px; padding-bottom: 15px; font-family: 'Trebuchet MS', Tahoma, sans-serif"><![endif]-->
         <div style="color:#555555;font-family:'Montserrat', 'Trebuchet MS', 'Lucida Grande', 'Lucida Sans Unicode', 'Lucida Sans', Tahoma, sans-serif;line-height:1.2;padding-top:15px;padding-right:15px;padding-bottom:15px;padding-left:40px;">
         <div style="line-height: 1.2; font-size: 12px; font-family: 'Montserrat', 'Trebuchet MS', 'Lucida Grande', 'Lucida Sans Unicode', 'Lucida Sans', Tahoma, sans-serif; color: #555555; mso-line-height-alt: 14px;">
         <p style="font-size: 14px; line-height: 1.2; word-break: break-word; text-align: left; font-family: Montserrat, 'Trebuchet MS', 'Lucida Grande', 'Lucida Sans Unicode', 'Lucida Sans', Tahoma, sans-serif; mso-line-height-alt: 17px; margin: 0;"><span style="font-size: 14px;"><strong>Date/Time:</strong></span></p>
         </div>
         </div>
         <!--[if mso]></td></tr></table><![endif]-->
         <table border="0" cellpadding="0" cellspacing="0" class="divider" role="presentation" style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;" valign="top" width="100%">
         <tbody>
         <tr style="vertical-align: top;" valign="top">
         <td class="divider_inner" style="word-break: break-word; vertical-align: top; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; padding-top: 20px; padding-right: 10px; padding-bottom: 10px; padding-left: 10px;" valign="top">
         <table align="center" border="0" cellpadding="0" cellspacing="0" class="divider_content" role="presentation" style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-top: 1px solid #BBBBBB; width: 100%;" valign="top" width="100%">
         <tbody>
         <tr style="vertical-align: top;" valign="top">
         <td style="word-break: break-word; vertical-align: top; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;" valign="top"><span></span></td>
         </tr>
         </tbody>
         </table>
         </td>
         </tr>
         </tbody>
         </table>
         <!--[if (!mso)&(!IE)]><!-->
         </div>
         <!--<![endif]-->
         </div>
         </div>
         <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
         <!--[if (mso)|(IE)]></td><td align="center" width="213" style="background-color:transparent;width:213px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px; padding-top:5px; padding-bottom:5px;"><![endif]-->
         <div class="col num3" style="display: table-cell; vertical-align: top; max-width: 320px; min-width: 213px; width: 213px;">
         <div style="width:100% !important;">
         <!--[if (!mso)&(!IE)]><!-->
         <div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:5px; padding-bottom:5px; padding-right: 0px; padding-left: 0px;">
         <!--<![endif]-->
         <div></div>
         <!--[if (!mso)&(!IE)]><!-->
         </div>
         <!--<![endif]-->
         </div>
         </div>
         <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
         <!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->
         </div>
         </div>
         </div>
         <div style="background-image:url('images/8e1e67be-df46-4142-bab1-17ee11dd1160.png');background-position:center top;background-repeat:no-repeat;background-color:transparent;overflow:hidden">
         <div class="block-grid three-up" style="min-width: 320px; max-width: 855px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; Margin: 0 auto; width: 100%; background-color: transparent;">
         <div style="border-collapse: collapse;display: table;width: 100%;background-color:transparent;">
         <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-image:url('images/8e1e67be-df46-4142-bab1-17ee11dd1160.png');background-position:center top;background-repeat:no-repeat;background-color:transparent;"><tr><td align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:855px"><tr class="layout-full-width" style="background-color:transparent"><![endif]-->
         <!--[if (mso)|(IE)]><td align="center" width="213" style="background-color:transparent;width:213px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px; padding-top:5px; padding-bottom:5px;"><![endif]-->
         <div class="col num3" style="display: table-cell; vertical-align: top; max-width: 320px; min-width: 213px; width: 213px;">
         <div style="width:100% !important;">
         <!--[if (!mso)&(!IE)]><!-->
         <div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:5px; padding-bottom:5px; padding-right: 0px; padding-left: 0px;">
         <!--<![endif]-->
         <div></div>
         <!--[if (!mso)&(!IE)]><!-->
         </div>
         <!--<![endif]-->
         </div>
         </div>
         <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
         <!--[if (mso)|(IE)]></td><td align="center" width="427" style="background-color:transparent;width:427px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px; padding-top:5px; padding-bottom:5px;"><![endif]-->
         <div class="col num6" style="display: table-cell; vertical-align: top; max-width: 320px; min-width: 426px; width: 427px;">
         <div style="width:100% !important;">
         <!--[if (!mso)&(!IE)]><!-->
         <div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:5px; padding-bottom:5px; padding-right: 0px; padding-left: 0px;">
         <!--<![endif]-->
         <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 15px; padding-left: 40px; padding-top: 15px; padding-bottom: 15px; font-family: 'Trebuchet MS', Tahoma, sans-serif"><![endif]-->
         <div style="color:#555555;font-family:'Montserrat', 'Trebuchet MS', 'Lucida Grande', 'Lucida Sans Unicode', 'Lucida Sans', Tahoma, sans-serif;line-height:1.2;padding-top:15px;padding-right:15px;padding-bottom:15px;padding-left:40px;">
         <div style="line-height: 1.2; font-size: 12px; font-family: 'Montserrat', 'Trebuchet MS', 'Lucida Grande', 'Lucida Sans Unicode', 'Lucida Sans', Tahoma, sans-serif; color: #555555; mso-line-height-alt: 14px;">
         <p style="font-size: 14px; line-height: 1.2; word-break: break-word; text-align: left; font-family: Montserrat, 'Trebuchet MS', 'Lucida Grande', 'Lucida Sans Unicode', 'Lucida Sans', Tahoma, sans-serif; mso-line-height-alt: 17px; margin: 0;"><span style="font-size: 14px;"><strong>Service name:</strong></span></p>
         </div>
         </div>
         <!--[if mso]></td></tr></table><![endif]-->
         <table border="0" cellpadding="0" cellspacing="0" class="divider" role="presentation" style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;" valign="top" width="100%">
         <tbody>
         <tr style="vertical-align: top;" valign="top">
         <td class="divider_inner" style="word-break: break-word; vertical-align: top; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; padding-top: 20px; padding-right: 20px; padding-bottom: 20px; padding-left: 20px;" valign="top">
         <table align="center" border="0" cellpadding="0" cellspacing="0" class="divider_content" role="presentation" style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-top: 1px solid #BBBBBB; width: 100%;" valign="top" width="100%">
         <tbody>
         <tr style="vertical-align: top;" valign="top">
         <td style="word-break: break-word; vertical-align: top; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;" valign="top"><span></span></td>
         </tr>
         </tbody>
         </table>
         </td>
         </tr>
         </tbody>
         </table>
         <!--[if (!mso)&(!IE)]><!-->
         </div>
         <!--<![endif]-->
         </div>
         </div>
         <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
         <!--[if (mso)|(IE)]></td><td align="center" width="213" style="background-color:transparent;width:213px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px; padding-top:5px; padding-bottom:5px;"><![endif]-->
         <div class="col num3" style="display: table-cell; vertical-align: top; max-width: 320px; min-width: 213px; width: 213px;">
         <div style="width:100% !important;">
         <!--[if (!mso)&(!IE)]><!-->
         <div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:5px; padding-bottom:5px; padding-right: 0px; padding-left: 0px;">
         <!--<![endif]-->
         <div></div>
         <!--[if (!mso)&(!IE)]><!-->
         </div>
         <!--<![endif]-->
         </div>
         </div>
         <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
         <!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->
         </div>
         </div>
         </div>
         <div style="background-image:url('images/8e1e67be-df46-4142-bab1-17ee11dd1160.png');background-position:center top;background-repeat:no-repeat;background-color:transparent;overflow:hidden">
         <div class="block-grid three-up" style="min-width: 320px; max-width: 855px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; Margin: 0 auto; width: 100%; background-color: transparent;">
         <div style="border-collapse: collapse;display: table;width: 100%;background-color:transparent;">
         <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-image:url('images/8e1e67be-df46-4142-bab1-17ee11dd1160.png');background-position:center top;background-repeat:no-repeat;background-color:transparent;"><tr><td align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:855px"><tr class="layout-full-width" style="background-color:transparent"><![endif]-->
         <!--[if (mso)|(IE)]><td align="center" width="213" style="background-color:transparent;width:213px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px; padding-top:5px; padding-bottom:5px;"><![endif]-->
         <div class="col num3" style="display: table-cell; vertical-align: top; max-width: 320px; min-width: 213px; width: 213px;">
         <div style="width:100% !important;">
         <!--[if (!mso)&(!IE)]><!-->
         <div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:5px; padding-bottom:5px; padding-right: 0px; padding-left: 0px;">
         <!--<![endif]-->
         <div></div>
         <!--[if (!mso)&(!IE)]><!-->
         </div>
         <!--<![endif]-->
         </div>
         </div>
         <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
         <!--[if (mso)|(IE)]></td><td align="center" width="427" style="background-color:transparent;width:427px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px; padding-top:5px; padding-bottom:5px;"><![endif]-->
         <div class="col num6" style="display: table-cell; vertical-align: top; max-width: 320px; min-width: 426px; width: 427px;">
         <div style="width:100% !important;">
         <!--[if (!mso)&(!IE)]><!-->
         <div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:5px; padding-bottom:5px; padding-right: 0px; padding-left: 0px;">
         <!--<![endif]-->
         <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 15px; padding-left: 40px; padding-top: 15px; padding-bottom: 15px; font-family: 'Trebuchet MS', Tahoma, sans-serif"><![endif]-->
         <div style="color:#555555;font-family:'Montserrat', 'Trebuchet MS', 'Lucida Grande', 'Lucida Sans Unicode', 'Lucida Sans', Tahoma, sans-serif;line-height:1.2;padding-top:15px;padding-right:15px;padding-bottom:15px;padding-left:40px;">
         <div style="line-height: 1.2; font-size: 12px; font-family: 'Montserrat', 'Trebuchet MS', 'Lucida Grande', 'Lucida Sans Unicode', 'Lucida Sans', Tahoma, sans-serif; color: #555555; mso-line-height-alt: 14px;">
         <p style="font-size: 14px; line-height: 1.2; word-break: break-word; text-align: left; font-family: Montserrat, 'Trebuchet MS', 'Lucida Grande', 'Lucida Sans Unicode', 'Lucida Sans', Tahoma, sans-serif; mso-line-height-alt: 17px; margin: 0;"><span style="font-size: 14px;"><strong>Staff name: </strong></span></p>
         </div>
         </div>
         <!--[if mso]></td></tr></table><![endif]-->
         <table border="0" cellpadding="0" cellspacing="0" class="divider" role="presentation" style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;" valign="top" width="100%">
         <tbody>
         <tr style="vertical-align: top;" valign="top">
         <td class="divider_inner" style="word-break: break-word; vertical-align: top; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; padding-top: 20px; padding-right: 20px; padding-bottom: 20px; padding-left: 20px;" valign="top">
         <table align="center" border="0" cellpadding="0" cellspacing="0" class="divider_content" role="presentation" style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-top: 1px solid #BBBBBB; width: 100%;" valign="top" width="100%">
         <tbody>
         <tr style="vertical-align: top;" valign="top">
         <td style="word-break: break-word; vertical-align: top; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;" valign="top"><span></span></td>
         </tr>
         </tbody>
         </table>
         </td>
         </tr>
         </tbody>
         </table>
         <!--[if (!mso)&(!IE)]><!-->
         </div>
         <!--<![endif]-->
         </div>
         </div>
         <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
         <!--[if (mso)|(IE)]></td><td align="center" width="213" style="background-color:transparent;width:213px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px; padding-top:5px; padding-bottom:5px;"><![endif]-->
         <div class="col num3" style="display: table-cell; vertical-align: top; max-width: 320px; min-width: 213px; width: 213px;">
         <div style="width:100% !important;">
         <!--[if (!mso)&(!IE)]><!-->
         <div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:5px; padding-bottom:5px; padding-right: 0px; padding-left: 0px;">
         <!--<![endif]-->
         <div></div>
         <!--[if (!mso)&(!IE)]><!-->
         </div>
         <!--<![endif]-->
         </div>
         </div>
         <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
         <!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->
         </div>
         </div>
         </div>
         <div style="background-image:url('images/2c0778ea-5d63-4f02-b646-bbd492f65bf4.png');background-position:center top;background-repeat:no-repeat;background-color:transparent;overflow:hidden">
         <div class="block-grid three-up" style="min-width: 320px; max-width: 855px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; Margin: 0 auto; width: 100%; background-color: transparent;">
         <div style="border-collapse: collapse;display: table;width: 100%;background-color:transparent;">
         <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-image:url('images/2c0778ea-5d63-4f02-b646-bbd492f65bf4.png');background-position:center top;background-repeat:no-repeat;background-color:transparent;"><tr><td align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:855px"><tr class="layout-full-width" style="background-color:transparent"><![endif]-->
         <!--[if (mso)|(IE)]><td align="center" width="213" style="background-color:transparent;width:213px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px; padding-top:0px; padding-bottom:0px;"><![endif]-->
         <div class="col num3" style="display: table-cell; vertical-align: top; max-width: 320px; min-width: 213px; width: 213px;">
         <div style="width:100% !important;">
         <!--[if (!mso)&(!IE)]><!-->
         <div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:0px; padding-bottom:0px; padding-right: 0px; padding-left: 0px;">
         <!--<![endif]-->
         <div></div>
         <!--[if (!mso)&(!IE)]><!-->
         </div>
         <!--<![endif]-->
         </div>
         </div>
         <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
         <!--[if (mso)|(IE)]></td><td align="center" width="427" style="background-color:transparent;width:427px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px; padding-top:5px; padding-bottom:5px;"><![endif]-->
         <div class="col num6" style="display: table-cell; vertical-align: top; max-width: 320px; min-width: 426px; width: 427px;">
         <div style="width:100% !important;">
         <!--[if (!mso)&(!IE)]><!-->
         <div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:5px; padding-bottom:5px; padding-right: 0px; padding-left: 0px;">
         <!--<![endif]-->
         <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 15px; padding-left: 40px; padding-top: 15px; padding-bottom: 15px; font-family: 'Trebuchet MS', Tahoma, sans-serif"><![endif]-->
         <div style="color:#555555;font-family:'Montserrat', 'Trebuchet MS', 'Lucida Grande', 'Lucida Sans Unicode', 'Lucida Sans', Tahoma, sans-serif;line-height:1.2;padding-top:15px;padding-right:15px;padding-bottom:15px;padding-left:40px;">
         <div style="line-height: 1.2; font-size: 12px; font-family: 'Montserrat', 'Trebuchet MS', 'Lucida Grande', 'Lucida Sans Unicode', 'Lucida Sans', Tahoma, sans-serif; color: #555555; mso-line-height-alt: 14px;">
         <p style="font-size: 14px; line-height: 1.2; word-break: break-word; text-align: left; font-family: Montserrat, 'Trebuchet MS', 'Lucida Grande', 'Lucida Sans Unicode', 'Lucida Sans', Tahoma, sans-serif; mso-line-height-alt: 17px; margin: 0;"><span style="font-size: 14px;"><strong>Total: </strong></span></p>
         </div>
         </div>
         <!--[if mso]></td></tr></table><![endif]-->
         <table border="0" cellpadding="0" cellspacing="0" class="divider" role="presentation" style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;" valign="top" width="100%">
         <tbody>
         <tr style="vertical-align: top;" valign="top">
         <td class="divider_inner" style="word-break: break-word; vertical-align: top; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; padding-top: 20px; padding-right: 20px; padding-bottom: 20px; padding-left: 20px;" valign="top">
         <table align="center" border="0" cellpadding="0" cellspacing="0" class="divider_content" role="presentation" style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-top: 1px solid #BBBBBB; width: 100%;" valign="top" width="100%">
         <tbody>
         <tr style="vertical-align: top;" valign="top">
         <td style="word-break: break-word; vertical-align: top; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;" valign="top"><span></span></td>
         </tr>
         </tbody>
         </table>
         </td>
         </tr>
         </tbody>
         </table>
         <!--[if (!mso)&(!IE)]><!-->
         </div>
         <!--<![endif]-->
         </div>
         </div>
         <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
         <!--[if (mso)|(IE)]></td><td align="center" width="213" style="background-color:transparent;width:213px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px; padding-top:5px; padding-bottom:5px;"><![endif]-->
         <div class="col num3" style="display: table-cell; vertical-align: top; max-width: 320px; min-width: 213px; width: 213px;">
         <div style="width:100% !important;">
         <!--[if (!mso)&(!IE)]><!-->
         <div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:5px; padding-bottom:5px; padding-right: 0px; padding-left: 0px;">
         <!--<![endif]-->
         <div></div>
         <!--[if (!mso)&(!IE)]><!-->
         </div>
         <!--<![endif]-->
         </div>
         </div>
         <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
         <!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->
         </div>
         </div>
         </div>
         <div style="background-image:url('images/nl11.png');background-position:center top;background-repeat:no-repeat;background-color:transparent;overflow:hidden">
         <div class="block-grid" style="min-width: 320px; max-width: 855px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; Margin: 0 auto; width: 100%; background-color: transparent;">
         <div style="border-collapse: collapse;display: table;width: 100%;background-color:transparent;">
         <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-image:url('images/nl11.png');background-position:center top;background-repeat:no-repeat;background-color:transparent;"><tr><td align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:855px"><tr class="layout-full-width" style="background-color:transparent"><![endif]-->
         <!--[if (mso)|(IE)]><td align="center" width="855" style="background-color:transparent;width:855px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px; padding-top:5px; padding-bottom:5px;"><![endif]-->
         <div class="col num12" style="min-width: 320px; max-width: 855px; display: table-cell; vertical-align: top; width: 855px;">
         <div style="width:100% !important;">
         <!--[if (!mso)&(!IE)]><!-->
         <div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:5px; padding-bottom:5px; padding-right: 0px; padding-left: 0px;">
         <!--<![endif]-->
         <table border="0" cellpadding="0" cellspacing="0" class="divider" role="presentation" style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;" valign="top" width="100%">
         <tbody>
         <tr style="vertical-align: top;" valign="top">
         <td class="divider_inner" style="word-break: break-word; vertical-align: top; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; padding-top: 60px; padding-right: 10px; padding-bottom: 10px; padding-left: 10px;" valign="top">
         <table align="center" border="0" cellpadding="0" cellspacing="0" class="divider_content" height="30" role="presentation" style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-top: 30px solid transparent; height: 30px; width: 100%;" valign="top" width="100%">
         <tbody>
         <tr style="vertical-align: top;" valign="top">
         <td height="30" style="word-break: break-word; vertical-align: top; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;" valign="top"><span></span></td>
         </tr>
         </tbody>
         </table>
         </td>
         </tr>
         </tbody>
         </table>
         <table border="0" cellpadding="0" cellspacing="0" class="divider" role="presentation" style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;" valign="top" width="100%">
         <tbody>
         <tr style="vertical-align: top;" valign="top">
         <td class="divider_inner" style="word-break: break-word; vertical-align: top; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; padding-top: 60px; padding-right: 10px; padding-bottom: 10px; padding-left: 10px;" valign="top">
         <table align="center" border="0" cellpadding="0" cellspacing="0" class="divider_content" height="30" role="presentation" style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-top: 30px solid transparent; height: 30px; width: 100%;" valign="top" width="100%">
         <tbody>
         <tr style="vertical-align: top;" valign="top">
         <td height="30" style="word-break: break-word; vertical-align: top; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;" valign="top"><span></span></td>
         </tr>
         </tbody>
         </table>
         </td>
         </tr>
         </tbody>
         </table>
         <table border="0" cellpadding="0" cellspacing="0" class="divider" role="presentation" style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;" valign="top" width="100%">
         <tbody>
         <tr style="vertical-align: top;" valign="top">
         <td class="divider_inner" style="word-break: break-word; vertical-align: top; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; padding-top: 60px; padding-right: 10px; padding-bottom: 10px; padding-left: 10px;" valign="top">
         <table align="center" border="0" cellpadding="0" cellspacing="0" class="divider_content" height="30" role="presentation" style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-top: 30px solid transparent; height: 30px; width: 100%;" valign="top" width="100%">
         <tbody>
         <tr style="vertical-align: top;" valign="top">
         <td height="30" style="word-break: break-word; vertical-align: top; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;" valign="top"><span></span></td>
         </tr>
         </tbody>
         </table>
         </td>
         </tr>
         </tbody>
         </table>
         <table border="0" cellpadding="0" cellspacing="0" class="divider" role="presentation" style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;" valign="top" width="100%">
         <tbody>
         <tr style="vertical-align: top;" valign="top">
         <td class="divider_inner" style="word-break: break-word; vertical-align: top; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; padding-top: 60px; padding-right: 10px; padding-bottom: 10px; padding-left: 10px;" valign="top">
         <table align="center" border="0" cellpadding="0" cellspacing="0" class="divider_content" height="30" role="presentation" style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-top: 30px solid transparent; height: 30px; width: 100%;" valign="top" width="100%">
         <tbody>
         <tr style="vertical-align: top;" valign="top">
         <td height="30" style="word-break: break-word; vertical-align: top; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;" valign="top"><span></span></td>
         </tr>
         </tbody>
         </table>
         </td>
         </tr>
         </tbody>
         </table>
         <!--[if (!mso)&(!IE)]><!-->
         </div>
         <!--<![endif]-->
         </div>
         </div>
         <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
         <!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->
         </div>
         </div>
         </div>
         <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
         </td>
         </tr>
         </tbody>
         </table>
         <!--[if (IE)]></div><![endif]-->
         </body>
         </html>`
        },
        Text: {
         Charset: "UTF-8",
         Data: "Hello!\n Welcome to Zattire. 33"
        }
       },
       Subject: {
        Charset: 'UTF-8',
        Data: 'Welcome to zattire'
       }
      },
    Source: 'preet@zattire.com', /* required */
    ReplyToAddresses: [
       'preet@zattire.com',
      /* more items */
    ],
  };
  
  // Create the promise and SES service object
  var sendPromise = new aws.SES({apiVersion: '2010-12-01'}).sendEmail(params).promise();
  
  // Handle promise's fulfilled/rejected states
  sendPromise.then(
    function(data) {
      console.log("Email sent")
      console.log(data.MessageId);
    }).catch(
      function(err) {
      console.error(err, err.stack);
    });
  res.send(`Hey you at Zattire (P).. ${aws.config.region}`)
})

// this is for 404
app.use(function (req, res, next) {
  var err = new Error("Not Found");
  err.name = "404";
  res.status(404);
  res.send(err);
});


export default app
