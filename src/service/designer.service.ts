import { Router, Request, Response } from "express";
import CONFIG from "../config";
import logger from "../utils/logger";
import Designer from "../models/designers.model";
import Event from "../models/event.model";
import EventDesignerI from "../interfaces/eventDesigner.model";
import mongoose from "../database";
import BaseService from "./base.service";


export default class DesignerService extends BaseService{

    constructor(){
        super(Designer)
    }


    //associating designers to events
    addDesignerEvent = async (req: Request, res: Response) => {
        try {
            const d: EventDesignerI = req.body
            const eventid= mongoose.Types.ObjectId(d.event_id)
            const designerId= mongoose.Types.ObjectId(d.designer_id)
            const designerEvent = await Event.findOneAndUpdate({ _id: eventid  }, {$push: {designers: designerId}})
            await Designer.findOneAndUpdate({_id: designerId}, {$push: {events: eventid}})
            res.send(designerEvent)
        } catch (e) {
            logger.error(`${e.message}`)
            res.status(403)
            res.send({ message: `${CONFIG.RES_ERROR} ${e.message}` })
        }
    }

    
}
