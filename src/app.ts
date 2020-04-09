import * as express from "express"
import * as bobyParser from "body-parser"
import * as morgan from "morgan"
import * as fs from "fs"
import * as path from "path"
import * as dotenv from "dotenv"
import router from "./routes/index.routes"
import * as aws from "aws-sdk"
import * as multer from "multer"
import * as multerS3 from "multer-s3"
import NewVendor from "./models/newVendor.model"
import logger from "./utils/logger"
import * as cors from "cors"

const app = express()
app.use(cors())

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
app.use(morgan(':remote-addr - :method :url :status :res[content-length] - :response-time ms'))

app.use(bobyParser.json())


app.use("/api", router)
app.get("/app/get-vendor", async (req: express.Request, res: express.Response) => {
  try{
    const nv = await NewVendor.find()
    res.send(nv)
  }catch(e){
    logger.error(e.message)
    res.status(403)
    res.send({error: e.message})
  }
})
app.use(express.static(path.join(__dirname, '../build')));

app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname, '../build', 'index.html'));
});

app.post("/create-vendor", async (req: express.Request, res: express.Response) => {
  const { name }= req.body
  console.log(req.body)
  const data = {
    name
  }
  try{
    const nv = await NewVendor.create(data)
    res.send(nv)
  }catch(e){
    logger.error(e.message)
    res.status(403)
    res.send({error: e.message})
  }
})

app.put("/update-vendor/:id", async (req: express.Request, res: express.Response) => {
  const _id = req.params.id
  
  try{
    const nv = await NewVendor.update({_id}, req.body)
    res.send(nv)
  }catch(e){
    logger.error(e.message)
    res.status(403)
    res.send({error: e.message})
  }
})


// this is for 404
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.name = "404";
    res.status(404)
    res.send(err);
});

const PORT = 8082

app.listen(PORT, async () => {
    console.log(`Server is running http://localhost:${PORT}`)
})