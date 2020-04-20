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
import { PhotoI } from "../interfaces/photo.interface";
import Photo from "../models/photo.model";

const designerRouter = Router()

export default class MakeupartistServiceC{

    static post = async (req: Request, res: Response) => {
        try {
            console.log(req.body);
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

    static get = async (req: Request, res: Response) => {
        try {
            const events = await MakeupArtist.find().populate('events').exec()
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
        const event = await MakeupArtist.findById(id).populate('photo_ids').populate('events').exec()
        res.send(event)
        } catch (e) {
            res.status(403)
            res.send(e.message)
        }
    }

    static put = async (req: Request, res: Response) => {
        try {
            const ma: MakeupArtistSI = req.body 
            const _id = req.params.id
            const newMakeupArtist = await MakeupArtist.findByIdAndUpdate({_id},  ma, { new: true }) // to return the updated data do - returning: true
            res.send(newMakeupArtist)
        } catch (e) {
            res.status(403)
            res.send({ message: `${CONFIG.RES_ERROR} ${e.message}` })
        }
    }

    //associating designers to events
    static addMakeupArtistEvent = async (req: Request, res: Response) => {
        try {
            const data : EventMakeupArtistI = req.body

            const eventId = mongoose.Types.ObjectId(data.event_id)
            const makeupArtistId = mongoose.Types.ObjectId(data.makeup_artist_id)
            const d = await Event.findOneAndUpdate({_id: eventId}, {$push: {makeup_artists: makeupArtistId} })
            await MakeupArtist.findOneAndUpdate({_id: makeupArtistId}, {$push: {events: eventId}})
            res.send(d)
        } catch (e) {
            logger.error(`${e.message}`)
            res.status(403)
            res.send({ message: `${CONFIG.RES_ERROR} ${e.message}` })
        }
    }

    //get data of associated
    static getMakeupArtistEvent = async (req: Request, res: Response) => {
        // try {
        //     const designerEvent = await EventDesigner.find()
        //     res.send(designerEvent)
        // } catch (e) {
        //     res.status(403)
        //     res.send(e.message)
        // }
    }

    static putPhoto = async (req: Request, res: Response) => {
        try {
            const photoData: PhotoI = req.body
            const _id = req.params.id
            // saving photos 
            const photo = await Photo.create(photoData)
            // adding it to event
            const newMakeupArtist = await MakeupArtist.findByIdAndUpdate({_id},  {$push: { photo_ids: photo._id }}, { new: true }).populate("photo_ids").exec() // to return the updated data do - returning: true
            res.send(newMakeupArtist)
        } catch (e) {
            logger.error(`MakeupArtist Put Photo ${e.message}`)
            res.status(403)
            res.send({ message: `${CONFIG.RES_ERROR} ${e.message}` })
        }
    }


    static getPhoto = async (req: Request, res: Response) => {
        try {
            const _id = req.params.id
            const makeupArtistPhotos = await MakeupArtist.findById(_id).select("photo_ids").populate("photo_ids").exec()
            res.send(makeupArtistPhotos);
        } catch (e) {
            logger.error(`MakeupArtist Get Photo ${e.message}`)
            res.status(403)
            res.send(e.message)
        }
    }

}
