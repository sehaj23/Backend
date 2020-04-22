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
            res.status(400)
            res.send({ message: `${CONFIG.RES_ERROR} ${e.message}` })
        }
    }
    

    //associating designers to events
    addMakeupArtistEvent = async (req: Request, res: Response) => {
        try {
            const data : EventMakeupArtistI = req.body
            if(!data.event_id || !data.makeup_artist_id){
                logger.error(`not comeplete data Refer EventMakeupArtistI Interface. event_id: ${data.event_id} & makeup_artist_id: ${data.makeup_artist_id}`)
                res.status(400)
                res.send({ message: `not comeplete data Refer EventMakeupArtistI Interface. event_id: ${data.event_id} & makeup_artist_id: ${data.makeup_artist_id}`})
                return
            }

            const eventId = mongoose.Types.ObjectId(data.event_id)
            const makeupArtistId = mongoose.Types.ObjectId(data.makeup_artist_id)
            
            const eventReq = Event.findOneAndUpdate( {_id: eventId, makeup_artists : { $nin: [makeupArtistId]} }, {$push: {makeup_artists: makeupArtistId} }, {new: true})
            //@ts-ignore
            const muaReq = MakeupArtist.findOneAndUpdate({_id: makeupArtistId, events : { $nin: [data.event_id]}}, {$push: {events: eventId}}, {new: true})
            const [e, mua] = await Promise.all([eventReq, muaReq])

            if(e === null || mua === null){
                logger.error(`Not able to update event`)
                res.status(400)
                res.send({ message: `Not able to update event: e -  ${e} & mua ${mua}` })
                return
            }
            res.send(e)
        } catch (e) {
            logger.error(`${e.message}`)
            res.status(400)
            res.send({ message: `${CONFIG.RES_ERROR} ${e.message}` })
        }
    }

    deleteMakeupArtistEvent = async (req: Request, res: Response) => {
        try {
            const data : EventMakeupArtistI = req.body
            if(!data.event_id || !data.makeup_artist_id){
                logger.error(`Not comeplete data Refer EventMakeupArtistI Interface. event_id: ${data.event_id} & makeup_artist_id: ${data.makeup_artist_id}`)
                res.status(400)
                res.send({ message: `not comeplete data Refer EventMakeupArtistI Interface. event_id: ${data.event_id} & makeup_artist_id: ${data.makeup_artist_id}`})
                return
            }

            const eventId = mongoose.Types.ObjectId(data.event_id)
            const makeupArtistId = mongoose.Types.ObjectId(data.makeup_artist_id)
            const eventReq =  Event.updateOne({_id: eventId, makeup_artists : { $in: [makeupArtistId]} }, {$pull: {makeup_artists: makeupArtistId} })
            //@ts-ignore
            const muaReq =  MakeupArtist.updateOne({_id: makeupArtistId, events: { $in: [eventId] }}, {$pull: {events: eventId}})
            const [e, mua] = await Promise.all([eventReq, muaReq]) 
            
            if(e.nModified === 0 || mua.nModified === 0){
                logger.error(`IDs do not match`)
                res.status(400)
                res.send({ message: `IDs do not match` })
                return
            }
            res.status(204)
            res.send(true)
        } catch (e) {
            logger.error(`${e.message}`)
            res.status(400)
            res.send({ message: `${CONFIG.RES_ERROR} ${e.message}` })
        }
    }
}
