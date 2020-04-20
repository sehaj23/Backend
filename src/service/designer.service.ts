import { Router, Request, Response } from "express";
import CONFIG from "../config";
import verifyToken from "../middleware/jwt";
import * as crypto from "crypto"
import logger from "../utils/logger";
import Designer from "../models/designers.model";
import Event from "../models/event.model";
import { DesignersI, DesignersSI } from "../interfaces/designer.interface";
import EventDesignerI from "../interfaces/eventDesigner.model";
import Vendor from "../models/vendor.model";
import mongoose from "../database";
import { PhotoI } from "../interfaces/photo.interface";
import Photo from "../models/photo.model";


export default class DesignerService{

    static post = async (req: Request, res: Response) => {
        try {
            const d: DesignersI = req.body
            const designer = await Designer.create(d)
            const _id = designer.vendor_id
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
            const events = await Designer.find().populate('events').exec()
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
        const designer = await Designer.findById(id).populate('events').exec()
        res.send(designer)
        } catch (e) {
            res.status(403)
            res.send(e.message)
        }
    }

    static put = async (req: Request, res: Response) => {
        try {
            const designerData: DesignersI = req.body
            const _id = req.params.id
            const newVendor = await Designer.findByIdAndUpdate( {_id}, designerData, {new: true}) // to return the updated data do - returning: true
            res.send(newVendor)
        } catch (e) {
            res.status(403)
            res.send({ message: `${CONFIG.RES_ERROR} ${e.message}` })
        }
    }

    //associating designers to events
    static addDesignerEvent = async (req: Request, res: Response) => {
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

    static putPhoto = async (req: Request, res: Response) => {
        try {
            const photoData: PhotoI = req.body
            const _id = req.params.id
            // saving photos 
            const photo = await Photo.create(photoData)
            // adding it to event
            const newdesigner = await Designer.findByIdAndUpdate({_id},  {$push: { photo_ids: photo._id }}, { new: true }).populate("photo_ids").exec() // to return the updated data do - returning: true
            res.send(newdesigner)
        } catch (e) {
            logger.error(`Designer Put Photo ${e.message}`)
            res.status(403)
            res.send({ message: `${CONFIG.RES_ERROR} ${e.message}` })
        }
    }


    static getPhoto = async (req: Request, res: Response) => {
        try {
            const _id = req.params.id
            const designerPhotos = await Designer.findById(_id).select("photo_ids").populate("photo_ids").exec()
            res.send(designerPhotos);
        } catch (e) {
            logger.error(`Designer Get Photo ${e.message}`)
            res.status(403)
            res.send(e.message)
        }
    }
}
