import { Router, Request, Response } from "express";
import CONFIG from "../config";
import verifyToken from "../middleware/jwt";
import * as crypto from "crypto"
import logger from "../utils/logger";
import Designer, { DesignersI } from "../models/designers.model";
import EventDesigner, {EventDesignerI} from "../models/eventDesigner.model";

const designerRouter = Router()

export default class DesignerService{

    static post = async (req: Request, res: Response) => {
        try {
            const {
                brand_name,
                designer_name,
                contact_number,
                email,
                start_price,
                end_price,
                outfit_types,
                speciality,
                location,
                insta_link,
                fb_link,
                start_working_hours,
                end_working_hours,
                vendor_id
            }: DesignersI = req.body

            const d: DesignersI = {
                brand_name,
                designer_name,
                contact_number,
                email,
                start_price,
                end_price,
                outfit_types,
                speciality,
                location,
                insta_link,
                fb_link,
                start_working_hours,
                end_working_hours,
                vendor_id
            }

            const designer = await Designer.create(d)

            res.send(designer)
        } catch (e) {
            logger.error(`${e.message}`)
            res.status(403)
            res.send({ message: `${CONFIG.RES_ERROR} ${e.message}` })
        }
    }

    static get = async (req: Request, res: Response) => {
        try {
            const events = await Designer.findAll()
            res.send(events)
        } catch (e) {
            res.status(403)
            res.send(e.message)
        }
    }

    static getId =  async (req: Request, res: Response) => {
            try {
            const id = req.params.id
            if(!id){
            const msg = 'Id not found for vendor.'
            logger.error(msg)
            res.status(403)
            res.send(msg)
        }
        const event = await Designer.findByPk(id)
        res.send(event)
        } catch (e) {
            res.status(403)
            res.send(e.message)
        }
    }

    static put = async (req: Request, res: Response) => {
        try {
            const {
                id,
                brand_name,
                designer_name,
                contact_number,
                email,
                start_price,
                end_price,
                outfit_types,
                speciality,
                location,
                insta_link,
                fb_link,
                start_working_hours,
                end_working_hours,
                vendor_id
            }: DesignersI = req.body

            const designerData: DesignersI = {
                brand_name,
                designer_name,
                contact_number,
                email,
                start_price,
                end_price,
                outfit_types,
                speciality,
                location,
                insta_link,
                fb_link,
                start_working_hours,
                end_working_hours,
                vendor_id
            }

            const [num, vendor] = await Designer.update(designerData, { where: { id: id! } }) // to return the updated data do - returning: true
            designerData.id = id

            res.send(designerData)
        } catch (e) {
            res.status(403)
            res.send({ message: `${CONFIG.RES_ERROR} ${e.message}` })
        }
    }

    //associating designers to events
    static addDesignerEvent = async (req: Request, res: Response) => {
        try {
            const {
                event_id,
                designer_id
            }: EventDesignerI = req.body

            const d: EventDesignerI = {
                event_id,
                designer_id
            }

            const designerEvent = await EventDesigner.create(d)

            res.send(designerEvent)
        } catch (e) {
            logger.error(`${e.message}`)
            res.status(403)
            res.send({ message: `${CONFIG.RES_ERROR} ${e.message}` })
        }
    }

    //get data of associated
    static getDesignerEvent = async (req: Request, res: Response) => {
        try {
            const designerEvent = await EventDesigner.findAll()
            res.send(designerEvent)
        } catch (e) {
            res.status(403)
            res.send(e.message)
        }
    }

}
