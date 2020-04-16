import { Router, Request, Response } from "express";
import CONFIG from "../config";
import verifyToken from "../middleware/jwt";
import * as crypto from "crypto"
import logger from "../utils/logger";
import Designer from "../models/designers.model";
import Event from "../models/event.model";
import EventI, { EventSI } from "../interfaces/event.interface";
import { PhotoI } from "../interfaces/photo.interface";
import Photo from "../models/photo.model";

const eventRouter = Router()

export default class EventService{

    static post = async (req: Request, res: Response) => {
        try {
           
            const e: EventI = req.body

            const event = await Event.create(e)

            res.send(event)
        } catch (e) {
            logger.error(`Event Post ${e.message}`)
            res.status(403)
            res.send({ message: `${CONFIG.RES_ERROR} ${e.message}` })
        }
    }

    static get = async (req: Request, res: Response) => {
        try {
            // let {limit, offset} = req.query;
            // const events = await Event.findAndCountAll({offset, limit})
            const events = await Event.find().populate("photo_ids").populate("designers").populate("makeup_artists").exec()
            res.send(events);
        } catch (e) {
            logger.error(`Event Get ${e.message}`)
            res.status(403)
            res.send(e.message)
        }
    }

    /*static get = async (req: Request, res: Response) => {
        try {
            let designerEvents = await EventDesigner.findAll();
            const result = await Promise.all(designerEvents.map(item => this.getDesignerEvent(req, item)));
            res.send(result);
        } catch (e) {
            res.status(403)
            res.send(e.message)
        }
    }

    async getDesignerEvent(req: Request, item: object){
        let {limit, offset} = req.query;
        const events = await Event.findAndCountAll({offset, limit})
    }*/



    static getId =  async (req: Request, res: Response) => {
        try {
            const _id = req.params.id
            if(!_id){
                const msg = 'Id not found for vendor.'
                logger.error(msg)
                res.status(403)
                res.send(msg)
            }
            const event = await Event.findById(_id).populate("photo_ids").populate("designers").populate("makeup_artists").exec()
            res.send(event)
        } catch (e) {
            logger.error(`Event Get By Id ${e.message}`)
            res.status(403)
            res.send(e.message)
        }
    }

    static put = async (req: Request, res: Response) => {
        try {
            const eventData: EventI = req.body
            const _id = req.params.id
            const newEvent = await Event.findByIdAndUpdate({_id},  eventData, { new: true }) // to return the updated data do - returning: true

            res.send(newEvent)
        } catch (e) {
            logger.error(`Event Put ${e.message}`)
            res.status(403)
            res.send({ message: `${CONFIG.RES_ERROR} ${e.message}` })
        }
    }

    static putPhoto = async (req: Request, res: Response) => {
        try {
            const photoData: PhotoI = req.body
            const _id = req.params.id
            // saving photos 
            const photo = await Photo.create(photoData)
            // adding it to event
            const newEvent = await Event.findByIdAndUpdate({_id},  {$push: { photo_ids: photo._id }}, { new: true }).populate("photo_ids").exec() // to return the updated data do - returning: true
            res.send(newEvent)
        } catch (e) {
            logger.error(`Event Put Photo ${e.message}`)
            res.status(403)
            res.send({ message: `${CONFIG.RES_ERROR} ${e.message}` })
        }
    }


    static getPhoto = async (req: Request, res: Response) => {
        try {
            const _id = req.params.id
            const eventPhotos = await Event.findById(_id).select("photo_ids").populate("photo_ids").exec()
            res.send(eventPhotos);
        } catch (e) {
            logger.error(`Event Get Photo ${e.message}`)
            res.status(403)
            res.send(e.message)
        }
    }

}
