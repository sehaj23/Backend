import { Router, Request, Response } from "express";
import CONFIG from "../../config";
import logger from "../../utils/logger";
import MakeupArtist from "../../models/makeupArtist.model";
import { EventMakeupArtistI } from "../../interfaces/eventMakeupArtist.interface";
import mongoose from "../../database";
import Event from "../../models/event.model";
import BaseService from "./base.service";
import { EmployeeI } from "../../interfaces/employee.interface";
import Employee from "../../models/employees.model";
import { MakeupArtistI } from "../../interfaces/makeupArtist.interface";
import Vendor from "../../models/vendor.model";

import ServiceI from "../../interfaces/service.interface";

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

    addMakeupArtistEmployee = async (req: Request, res: Response) => {
        try {
            const d: EmployeeI = req.body
            const _id = mongoose.Types.ObjectId(req.params.id)
            if(!_id){
                const errMsg = `Add Emp: no data with this _id and service was found`
                logger.error(errMsg)
                res.status(400)
                res.send({ message: errMsg })
                return
            }

            //@ts-ignore
            d.services = (d.services as string[]).map( (s: string, i: number) => mongoose.Types.ObjectId(s))

            const emp = await Employee.create(d)
            const empId = mongoose.Types.ObjectId(emp._id)
            //@ts-ignore
            const newSalon = await MakeupArtist.findOneAndUpdate({_id, employees: {$nin: [empId]}}, { $push : {employees  : empId}}, {new: true}).populate("employees").exec()
            if(newSalon === null){
                const errMsg = `Add Emp: no data with this _id and service was found`
                logger.error(errMsg)
                res.status(403)
                res.send({ message: errMsg })
                return
            }
            res.send(newSalon)
        }catch(e){
            logger.error(`${e.message}`)
            res.status(403)
            res.send({ message: `${CONFIG.RES_ERROR} ${e.message}` })
        }
    }

    deleteMakeupArtistEmployee = async (req: Request, res: Response) => {
        try {
            const _id = mongoose.Types.ObjectId(req.params.id)
            const eid = mongoose.Types.ObjectId(req.params.eid)
            if(!_id || !eid){
                const errMsg = `delete Emp: no data with this _id and service was found`
                logger.error(errMsg)
                res.status(403)
                res.send({ message: errMsg })
                return
            }

            
            const emp = await Employee.findByIdAndDelete(eid)
            //@ts-ignore
            const newSalon = await MakeupArtist.findOneAndUpdate({_id, employees: {$in: [eid]}}, { $pull : {employees  : eid}}, {new: true}).populate("employees").exec()
            if(newSalon === null){
                const errMsg = `delete Emp: no data with this _id and service was found`
                logger.error(errMsg)
                res.status(403)
                res.send({ message: errMsg })
                return
            }
            res.send(newSalon)
        }catch(e){
            logger.error(`${e.message}`)
            res.status(403)
            res.send({ message: `${CONFIG.RES_ERROR} ${e.message}` })
        }
    }

    addMakeupArtistService = async (req: Request, res: Response) => {
        try {
            const d: ServiceI = req.body.services
            const _id = mongoose.Types.ObjectId(req.params.id)
            if(!_id){
                logger.error(`Salon Id is missing salon_id:  & mua_id:`)
                res.status(403)
                res.send({ message: `Salon Id is missing salon_id:  & mua_id:` })
                return
            }

          //  const service = await MakeupArtist.findByIdAndUpdate({id:_id},{$push:{services:d}},{new:true});
        //     await MakeupArtist.findOne({_id}).then(_MakeupArtist=>{
        //        const newService = {
        //         services:d,
        //        };
        //        _MakeupArtist.services.unshift(newService);
        //        _MakeupArtist.save().then(profile => res.json(_MakeupArtist));
        //    })
            
            const mua = await MakeupArtist.findOneAndUpdate({_id}, { $push : {services  : {$each:d,$postion:0}}}, {new: true})
            if(mua === null){
                const errMsg = `Add Services: no data with this _id and service was found`
                logger.error(errMsg)
                res.status(403)
                res.send({ message: errMsg })
                return
            }
            console.log(mua)
            res.send(mua)
        }catch(e){
            logger.error(`${e.message}`)
            res.status(403)
            res.send({ message: `${CONFIG.RES_ERROR} ${e.message}` })
        }
    }
    
  deleteMakeupArtistService = async (req: Request, res: Response) => {
        try {
            const sid = req.params.sid
            const _id = req.params.id
          if(!_id || !sid){
                logger.error(`Salon Id is missing salon_id:  & mua_id: `)
                res.status(403)
                res.send({ message: `Salon Id is missing salon_id: ` })
                return
            }
            const osid = mongoose.Types.ObjectId(sid)

       
            // @ts-ignore
            const newSalon = await MakeupArtist.findOneAndUpdate({_id, services : {$in : [osid]}}, {$pull: {services : osid}}, {new: true})
            if(newSalon === null){
                const errMsg = `Delete Service: no data with this _id and service was found`
                logger.error(errMsg)
                res.status(403)
                res.send({ message: errMsg })
                return
            }
            res.send(newSalon)
        }catch(e){
            logger.error(`${e.message}`)
            res.status(403)
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
