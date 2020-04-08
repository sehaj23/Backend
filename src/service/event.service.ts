import { Router, Request, Response } from "express";
import CONFIG from "../config";
import verifyToken from "../middleware/jwt";
import * as crypto from "crypto"
import logger from "../utils/logger";
import Designer from "../models/designers.model";
import EventDesigner from "../models/eventDesigner.model";
import Event from "../models/event.model";
import EventI, { EventSI } from "../interfaces/event.interface";

const eventRouter = Router()

export default class EventService{

    static post = async (req: Request, res: Response) => {
        try {
           
            const e: EventI = req.body

            const event = await Event.create(e)

            res.send(event)
        } catch (e) {
            res.status(403)
            res.send({ message: `${CONFIG.RES_ERROR} ${e.message}` })
        }
    }

    static get = async (req: Request, res: Response) => {
        try {
            // let {limit, offset} = req.query;
            // const events = await Event.findAndCountAll({offset, limit})
            const events = await Event.find()
            res.send(events);
        } catch (e) {
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
            const event = await Event.findById(_id)
            res.send(event)
        } catch (e) {
            res.status(403)
            res.send(e.message)
        }
    }

    static put = async (req: Request, res: Response) => {
        try {
            const eventData: EventSI = req.body
            const _id = req.body.id
            const [num, event] = await Event.update(eventData, { where: { _id } }) // to return the updated data do - returning: true
            eventData._id = _id

            res.send(eventData)
        } catch (e) {
            res.status(403)
            res.send({ message: `${CONFIG.RES_ERROR} ${e.message}` })
        }
    }
}
