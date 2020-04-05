import * as express from "express"
import * as bobyParser from "body-parser"
import * as morgan from "morgan"
import * as fs from "fs"
import * as path from "path"
import * as dotenv from "dotenv"
import { sequelize } from "./database"
import router from "./routes/index.routes"
import * as aws from "aws-sdk"
import * as multer from "multer"
import * as multerS3 from "multer-s3"

const app = express()

const spacesEndpoint = new aws.Endpoint('nyc3.digitaloceanspaces.com');
const s3 = new aws.S3({
  //@ts-ignore
  endpoint: spacesEndpoint,
  accessKeyId: "DQC6AT6WECGTVTPBMEPW",
  secretAccessKey: "1aG2MQPG1CBJS01q/y6pjLwRVNgzPwfkNkvWa3XCrp8"
});

const upload = multer({
    storage: multerS3({
      s3: s3,
      bucket: 'zattire',
      acl: 'public-read',
      key: function (request, file, cb) {
        console.log(file);
        cb(null, file.originalname);
      }
    })
  }).array('upload', 1);

  app.post('/upload', function (request, response, next) {
    upload(request, response, function (error) {
      if (error) {
        console.log(error);
        return response.redirect("/error");
      }
      console.log('File uploaded successfully.');
      response.redirect("/success");
    });
  });

dotenv.config()

const accessLogStream = fs.createWriteStream('access.log', { flags: 'a' })

// setup the logger
// app.use(morgan('combined', { stream: accessLogStream }))
app.use(morgan('dev'))

app.use(bobyParser.json())
sequelize.authenticate().then(() => {
    console.log("Database connected...")
}).catch((err: any) => {
    console.log(`Error: ${err.message}`)
})

app.use("/api", router)
app.use(express.static(path.join(__dirname, '../build')));

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, '../build', 'index.html'));
});

// this is for 404
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.name = "404";
    res.status(404)
    res.send(err);
});

const PORT = 8080

app.listen(PORT, async () => {
    try {
        // await sequelize.sync({ force: true })
        // await sequelize.sync({alter: true})
    } catch (error) {

    }
    console.log(`Server is running http://localhost:${PORT}`)
})