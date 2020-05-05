import mongoose from "../../database";
import logger from "../../utils/logger";
import { Request, Response } from "express";
import CONFIG from "../../config";
import { PhotoI } from "../../interfaces/photo.interface";
import Photo from "../../models/photo.model";


export default class BaseService {
    private model: mongoose.Model<any, any>
    private modelName: string

    constructor(model: mongoose.Model<any, any>) {
        this.model = model
        this.modelName = model.modelName
    }

    post = async (req: Request, res: Response) => {
        try {

            const e = req.body

            const event = await this.model.create(e)

            res.send(event)
        } catch (e) {
            logger.error(`${this.modelName} Post ${e.message}`)
            res.status(403)
            res.send({ message: `${e.message}` })
        }
    }

    get = async (req: Request, res: Response) => {
        try {
            // let {limit, offset} = req.query;
            // const this.models = await this.model.findAndCountAll({offset, limit})
            const events = await this.model.find().select("-password")//populate("user_id").populate("salon_id").populate("designer_id").populate("makeup_artist_id").populate("salons").populate("designers").populate("makeup_artists").populate("photo_ids").exec()
            res.send(events);
        } catch (e) {
            logger.error(`${this.modelName} Get ${e.message}`)
            res.status(403)
            res.send(e.message)
        }
    }

    getId = async (req: Request, res: Response) => {
        try {
            const id = req.params.id
            if (!id) {
                const msg = 'Id not found for vendor.'
                logger.error(msg)
                res.status(403)
                res.send(msg)
                return
            }
            const event = await this.model.findById(id).select("-password").populate("employees").populate("user_id").populate("salon_id").populate("designer_id").populate("makeup_artist_id").populate("services").populate('events').populate("salons").populate("designers").populate("makeup_artists").populate("photo_ids").exec()
            if (event === null) {
                const msg = `${this.modelName} no data found with this id `
                logger.error(msg)
                res.status(403)
                res.send(msg)
                return
            }
            console.log(event)
            res.send(event)
        } catch (e) {
            logger.error(`${this.modelName} Get ${e.message}`)
            res.status(403)
            res.send(e.message)
        }
    }

    put = async (req: Request, res: Response) => {
        try {
            const eventData = req.body
            const _id = req.params.id
            const newEvent = await this.model.findByIdAndUpdate({ _id }, eventData, { new: true }) // to return the updated data do - returning: true

            res.send(newEvent)
        } catch (e) {
            logger.error(`${this.modelName} Put ${e.message}`)
            res.status(403)
            res.send({ message: `${CONFIG.RES_ERROR} ${e.message}` })
        }
    }


    putPhoto = async (req: Request, res: Response) => {
        try {
            const photoData: PhotoI = req.body
            const _id = req.params.id
            // saving photos 
            const photo = await Photo.create(photoData)
            // adding it to event
            //@ts-ignore
            const newEvent = await this.model.findByIdAndUpdate({ _id }, { $push: { photo_ids: photo._id } }, { new: true }).populate("photo_ids").exec() // to return the updated data do - returning: true
            res.send(newEvent)
        } catch (e) {
            logger.error(`${this.modelName} Put Photo ${e.message}`)
            res.status(403)
            res.send({ message: `${CONFIG.RES_ERROR} ${e.message}` })
        }
    }

    getPhoto = async (req: Request, res: Response) => {
        try {
            const _id = req.params.id
            const eventPhotos = await this.model.findById(_id).select("photo_ids").populate("photo_ids").exec()
            res.send(eventPhotos);
        } catch (e) {
            logger.error(`${this.modelName} Get Photo ${e.message}`)
            res.status(403)
            res.send(e.message)
        }
    }

}