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


export default class DesignerService extends BaseService{

    constructor(){
        super(Designer)
    }

    post = async (req: Request, res: Response) => {
        try {
            const d: DesignersI = req.body
            const designer = await Designer.create(d)
            const _id = designer.vendor_id
            await Vendor.findOneAndUpdate({_id}, {$push: {designers: designer._id}})
            res.send(designer)
        } catch (e) {
            logger.error(`${e.message}`)
            res.status(400)
            res.send({ message: `${CONFIG.RES_ERROR} ${e.message}` })
        }
    }


    //associating designers to events
    addDesignerEvent = async (req: Request, res: Response) => {
        try {
            const d: EventDesignerI = req.body
            const eventid= mongoose.Types.ObjectId(d.event_id)
            const designerId= mongoose.Types.ObjectId(d.designer_id)
            const designerEventReq =  Event.findOneAndUpdate({_id: eventid, designers: { $nin: [designerId] } }, {$push: {designers: designerId}}, {new: true})
            
            const newDesignerReq = Designer.findOneAndUpdate({_id: designerId, events: { $nin: [eventid] } }, {$push: {events: eventid}}, {new: true})
            const [designerEvent, newDesigner] = await Promise.all([designerEventReq, newDesignerReq])
            if(designerEvent === null || newDesigner === null){
                logger.error(`Not able to update event`)
                res.status(400)
                res.send({ message: `Not able to update event: eventid -  ${eventid}, event_id: ${d.event_id}` })
                return
            }
            console.log(designerEvent)
            console.log(newDesigner)
            res.send(designerEvent)
        } catch (e) {
            logger.error(`${e.message}`)
            res.status(400)
            res.send({ message: `${CONFIG.RES_ERROR} ${e.message}` })
        }
    }

    deleteDesignerEvent = async (req: Request, res: Response) => {
        try {
            const d: EventDesignerI = req.body
            const eventid= d.event_id
            const designerId= d.designer_id
            console.log(eventid)
            console.log(designerId)
            const designerEventReq =  Event.updateOne({_id: eventid, designers: { $in: [designerId] } }, { $pull: { "designers" : designerId}})
            const newDesignerReq = Designer.updateOne({_id: designerId, events: { $in: [eventid] }}, { $pull: { "events" : eventid}})
            
            const [designerEvent, newDesigner] = await Promise.all([designerEventReq, newDesignerReq])
            console.log(designerEvent)
            console.log(newDesigner)
            if(designerEvent.nModified === 0 || newDesigner.nModified === 0){
                logger.error(`IDs do not match`)
                res.status(400)
                res.send({ message: `IDs do not match` })
                return
            }

            res.status(204)
            res.send(true)
        } catch (e) {
            console.log("**************")
            console.log(e.message)
            console.log("**************")
            logger.error(`${e.message}`)
            res.status(400)
            res.send({ message: `${CONFIG.RES_ERROR} ${e.message}` })
        }
    }

    
}
