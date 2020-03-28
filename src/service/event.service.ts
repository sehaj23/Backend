import { Router, Request, Response } from "express";
import CONFIG from "../config";
import verifyToken from "../middleware/jwt";
import * as crypto from "crypto"
import logger from "../utils/logger";
import Designer, { DesignersI } from "../models/designers.model";
import EventDesigner, {EventDesignerI} from "../models/eventDesigner.model";
import Event, {EventI} from "../models/event.model";

const eventRouter = Router()

export default class EventService{

    static post = async (req: Request, res: Response) => {
        try {
            const {
                name,
                description,
                entryProcedure,
                exhibitionHouse,
                startDate,
                endDate,
                location,
            } = req.body

            const e: EventI = {
                name,
                description,
                entry_procedure: entryProcedure,
                exhibition_house: exhibitionHouse,
                start_date: startDate,
                end_date: endDate,
                location
            }

            const event = await Event.create(e)

            res.send(event)
        } catch (e) {
            res.status(403)
            res.send({ message: `${CONFIG.RES_ERROR} ${e.message}` })
        }
    }

    static get = async (req: Request, res: Response) => {
        try {
            let {limit, offset} = req.query;
            const events = await Event.findAndCountAll({offset, limit})
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
            const id = req.params.id
            if(!id){
                const msg = 'Id not found for vendor.'
                logger.error(msg)
                res.status(403)
                res.send(msg)
            }
            const event = await Event.findByPk(id)
            res.send(event)
        } catch (e) {
            res.status(403)
            res.send(e.message)
        }
    }

    static put = async (req: Request, res: Response) => {
        try {
            const { id, name,
                start_date,
                end_date,
                location,
                entry_procedure,
                exhibition_house,
                description } = req.body


            const eventData: EventI = {
                name,
                start_date,
                end_date,
                location,
                entry_procedure,
                exhibition_house,
                description
            }

            const [num, event] = await Event.update(eventData, { where: { id } }) // to return the updated data do - returning: true
            eventData.id = id

            res.send(eventData)
        } catch (e) {
            res.status(403)
            res.send({ message: `${CONFIG.RES_ERROR} ${e.message}` })
        }
    }
}
