import { Router, Request, Response } from "express";
import CONFIG from "../config";
import verifyToken from "../middleware/jwt";
import * as crypto from "crypto"
import logger from "../utils/logger";
import Designer from "../models/designers.model";
import MakeupArtist from "../models/makeupArtist.model";
import MakeupArtistSI, { MakeupArtistI } from "../interfaces/makeupArtist.interface";
import EventDesignerI from "../interfaces/eventDesigner.model";
import Vendor from "../models/vendor.model";
import { EventMakeupArtistI } from "../interfaces/eventMakeupArtist.interface";
import mongoose from "../database";
import Event from "../models/event.model";
import BaseService from "./base.service";
import { EventSI } from "../interfaces/event.interface";

export default class MakeupartistServiceC extends BaseService{

    constructor(){
        super(MakeupArtist)
    }

    post = async (req: Request, res: Response) => {
        try {
            const ma: MakeupArtistI = req.body 
            const makeupartist = await MakeupArtist.create(ma)
            const _id = makeupartist.vendor_id
            await Vendor.findOneAndUpdate({_id}, {$push: {makeup_artists: makeupartist._id}})
            
            res.send(makeupartist)
        } catch (e) {
            logger.error(`${e.message}`)
            res.status(403)
            res.send({ message: `${CONFIG.RES_ERROR} ${e.message}` })
        }
    }
    

    //associating designers to events
    addMakeupArtistEvent = async (req: Request, res: Response) => {
        try {
            const data : EventMakeupArtistI = req.body

            const eventId = mongoose.Types.ObjectId(data.event_id)
            const makeupArtistId = mongoose.Types.ObjectId(data.makeup_artist_id)
            const eventReq = Event.findByIdAndUpdate( eventId, {$push: {makeup_artists: makeupArtistId} })
            const muaReq = MakeupArtist.findByIdAndUpdate(makeupArtistId, {$push: {events: eventId}})
            const [e, mua] = await Promise.all([eventReq, muaReq])
            res.send(e)
        } catch (e) {
            logger.error(`${e.message}`)
            res.status(403)
            res.send({ message: `${CONFIG.RES_ERROR} ${e.message}` })
        }
    }

    deleteMakeupArtistEvent = async (req: Request, res: Response) => {
        try {
            const data : EventMakeupArtistI = req.body

            const eventId = mongoose.Types.ObjectId(data.event_id)
            const makeupArtistId = mongoose.Types.ObjectId(data.makeup_artist_id)
            const eventReq =  Event.updateOne({_id: eventId}, {$pull: {makeup_artists: makeupArtistId} })
            const muaReq =  MakeupArtist.updateOne({_id: makeupArtistId}, {$pull: {events: eventId}})
            const [e, mua] = await Promise.all([eventReq, muaReq]) 
            
            if(e.nModified === 0 ){
                logger.error(`IDs do not match`)
                res.status(403)
                res.send({ message: `IDs do not match` })
                return
            }
            res.status(204)
            res.send(true)
        } catch (e) {
            logger.error(`${e.message}`)
            res.status(403)
            res.send({ message: `${CONFIG.RES_ERROR} ${e.message}` })
        }
    }
}
