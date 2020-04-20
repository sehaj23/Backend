import { Router, Request, Response } from "express";
import CONFIG from "../config";
import logger from "../utils/logger";
import Designer from "../models/designers.model";
import Event from "../models/event.model";
import EventDesignerI from "../interfaces/eventDesigner.model";
import mongoose from "../database";
import BaseService from "./base.service";
import { DesignersI } from "../interfaces/designer.interface";
import Vendor from "../models/vendor.model";
import Salon from "../models/salon.model";
import { SalonI } from "../interfaces/salon.interface";


export default class SalonService extends BaseService{

    constructor(){
        super(Salon)
    }

    post = async (req: Request, res: Response) => {
        try {
            const d: SalonI = req.body
            const salon = await Salon.create(d)
            const _id = salon.vendor_id
            await Vendor.findOneAndUpdate({_id}, {$push: {salons: salon._id}})
            res.send(salon)
        } catch (e) {
            logger.error(`${e.message}`)
            res.status(403)
            res.send({ message: `${CONFIG.RES_ERROR} ${e.message}` })
        }
    }


    //associating designers to events
    addDesignerEvent = async (req: Request, res: Response) => {
        try {
            const d: EventDesignerI = req.body
            const eventid= mongoose.Types.ObjectId(d.event_id)
            const designerId= mongoose.Types.ObjectId(d.designer_id)
            const designerEvent = await Event.findOneAndUpdate({ _id: eventid  }, {$push: {designers: designerId}}, {new: true})
            if(designerEvent == null){
                logger.error(`Not able to update event`)
                res.status(403)
                res.send({ message: `Not able to update event: eventid -  ${eventid}, event_id: ${d.event_id}` })
            }
            const newDesigner = await Designer.findOneAndUpdate({_id: designerId}, {$push: {events: eventid}}, {new: true})
            res.send({newDesigner, designerEvent})
        } catch (e) {
            logger.error(`${e.message}`)
            res.status(403)
            res.send({ message: `${CONFIG.RES_ERROR} ${e.message}` })
        }
    }

    
}
