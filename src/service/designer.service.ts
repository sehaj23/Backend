import { Router, Request, Response } from "express";
import CONFIG from "../config";
import verifyToken from "../middleware/jwt";
import * as crypto from "crypto"
import logger from "../utils/logger";
import Designer from "../models/designers.model";
import EventDesigner from "../models/eventDesigner.model";
import Event from "../models/event.model";
import { DesignersI, DesignersSI } from "../interfaces/designer.interface";
import EventDesignerI from "../interfaces/eventDesigner.model";
import Vendor from "../models/vendor.model";

const designerRouter = Router()

export default class DesignerService{

    static post = async (req: Request, res: Response) => {
        try {
            const d: DesignersI = req.body
            const designer = await Designer.create(d)
            const _id = designer.vendor_id//designers designers designers
            await Vendor.findOneAndUpdate({_id}, {$push: {designers: designer._id}})
            res.send(designer)
        } catch (e) {
            logger.error(`${e.message}`)
            res.status(403)
            res.send({ message: `${CONFIG.RES_ERROR} ${e.message}` })
        }
    }

    static get = async (req: Request, res: Response) => {
        try {
            const events = await Designer.find()
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
        const event = await Designer.findById(id)
        res.send(event)
        } catch (e) {
            res.status(403)
            res.send(e.message)
        }
    }

    static put = async (req: Request, res: Response) => {
        try {
            const designerData: DesignersSI = req.body
            const _id = req.body._id

            const [num, vendor] = await Designer.update(designerData, { where: { _id: _id } }) // to return the updated data do - returning: true
            designerData._id = _id

            res.send(designerData)
        } catch (e) {
            res.status(403)
            res.send({ message: `${CONFIG.RES_ERROR} ${e.message}` })
        }
    }

    //associating designers to events
    static addDesignerEvent = async (req: Request, res: Response) => {
        try {
            const d: EventDesignerI = req.body
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
            const designerEvent = await EventDesigner.find()
            res.send(designerEvent)
        } catch (e) {
            console.log(e);
            logger.error(`${e.message}`)
            res.status(403)
            res.send(e.message)
        }
    }

}
