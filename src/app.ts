import * as express from "express"
import * as bobyParser from "body-parser"
import * as morgan from "morgan"
import * as fs from "fs"
import * as path from "path"
import * as dotenv from "dotenv"
import { sequelize } from "./database"
import Photo, { PhotoI } from "./models/photo.model"
import Event, { EventI } from "./models/event.model"
import indexRouter from "./controller/index.controller"

const app = express()

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

app.use("/api", indexRouter)
app.use(express.static(path.join(__dirname, '../build')));

app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname, '../build', 'index.html'));
});
app.get("/p", async (req: express.Request, res: express.Response) => {

    const eId = 1
    const e = await Event.findByPk(eId)
    if (e != null)
        if (e?.photo_ids !== undefined) {
            const p = await Photo.findAll({ where: { id: e.photo_ids } })
            res.send({
                e,
                p
            })
            return
        }

    if (e != null) {

        // const photo: PhotoI ={
        //     name: "My Pic",
        //     url: "http",
        //     photo_type: 'Original'
        // }

        // const p = await Photo.create(photo)
        // console.log(p)
        // if(e.photo_ids === undefined || e.photo_ids == null){
        //     const nwA = [p.id!]
        //     e.photo_ids = nwA
        // }else
        //     e.photo_ids?.push(p.id!)
        // const newE = await e.save()
        // console.log(newE);
        res.send({
            // newE,
            e,
            // p
        })
    } else {
        res.send(e)
    }
})

app.get("/aaapp", async (req: express.Request, res: express.Response) => {

    const event: EventI = {
        name: "Cool Event",
        start_date: new Date('02-27-2019 10:00'),
        end_date: new Date('02-27-2019 12:00'),
        location: "Taj, Delhi",
        entry_procedure: "Rs. 500 per person",
        exhibition_house: "Chhabra House of Design",
        description: "It is a cool event",
    }

    try {
        const e = await Event.create(event)
        console.log(e);
        const photo: PhotoI = {
            name: "My Pic",
            url: "http",
            photo_type: 'Original'
        }

        const p = await Photo.create(photo)
        console.log(p)
        if (e.photo_ids === undefined || e.photo_ids == null) {
            const nwA = [p.id!]
            e.photo_ids = nwA
        } else
            e.photo_ids?.push(p.id!)
        const newE = await e.save()
        console.log(newE);
        res.send({
            newE,
            e,
            p
        })
    } catch (error) {
        console.log(error);

    }

})

const PORT = 8080



app.listen(PORT, async () => {
    try {
        // await sequelize.sync({ force: true })
        // await sequelize.sync({alter: true})
    } catch (error) {

    }
    console.log(`Server is running http://localhost:${PORT}`)
})