import { Router, Request, Response } from "express";
import CONFIG from "../config";
import logger from "../utils/logger";
import Event from "../models/event.model";
import EventDesignerI from "../interfaces/eventDesigner.model";
import mongoose from "../database";
import BaseService from "./base.service";
import { DesignersI } from "../interfaces/designer.interface";
import Vendor from "../models/vendor.model";
import Salon from "../models/salon.model";
import { SalonI } from "../interfaces/salon.interface";
import ServiceI from "../interfaces/service.interface";
import Service from "../models/service.model";
import { EmployeeI } from "../interfaces/employee.interface";
import Employee from "../models/employees.model";
import Offer from "../models/offer.model";


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

    getOffer = async (req: Request, res: Response) => {
        try{
            const id = req.params.id
            if(!id){
                const errMsg = `id is missing from the params`
                logger.error(errMsg)
                res.status(400)
                res.send({message: errMsg})
                return
            }
            const offers = await Offer.find({salon_id: id})
            if(offers === null || offers.length === 0){
                const errMsg = `no offers found`
                logger.error(errMsg)
                res.status(400)
                res.send({message: errMsg})
                return
            }
            res.send(offers)
        }catch(e){
            logger.error(`Booking Offer ${e.message}`)
            res.status(403)
            res.send({ message: `${e.message}` })
        }
    }


    getService = async (req: Request, res: Response) => {
        try{
            const id = req.params.id
            if(!id){
                const errMsg = `id is missing from the params`
                logger.error(errMsg)
                res.status(400)
                res.send({message: errMsg})
                return
            }
            const monogId = mongoose.Types.ObjectId(id)
            //@ts-ignore
            const services = await Service.find({salon_id: monogId})
            if(services === null || services.length === 0){
                const errMsg = `no service found`
                logger.error(errMsg)
                res.status(400)
                res.send({message: errMsg})
                return
            }
            res.send(services)
        }catch(e){
            logger.error(`Booking service ${e.message}`)
            res.status(403)
            res.send({ message: `${e.message}` })
        }
    }

    addSalonEmployee = async (req: Request, res: Response) => {
        try {
            const d: EmployeeI = req.body
            const _id = mongoose.Types.ObjectId(req.params.id)
            if(!_id){
                const errMsg = `Add Emp: no data with this _id and service was found`
                logger.error(errMsg)
                res.status(403)
                res.send({ message: errMsg })
                return
            }

            //@ts-ignore
            d.services = (d.services as string[]).map( (s: string, i: number) => mongoose.Types.ObjectId(s))

            const emp = await Employee.create(d)
            const empId = mongoose.Types.ObjectId(emp._id)
            //@ts-ignore
            const newSalon = await Salon.findOneAndUpdate({_id, employees: {$nin: [empId]}}, { $push : {employees  : empId}}, {new: true}).populate("employees").exec()
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

    deleteSalonEmployee = async (req: Request, res: Response) => {
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
            const newSalon = await Salon.findOneAndUpdate({_id, employees: {$in: [eid]}}, { $pull : {employees  : eid}}, {new: true}).populate("employees").exec()
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

    addSalonService = async (req: Request, res: Response) => {
        try {
            const d: ServiceI = req.body
            const _id = mongoose.Types.ObjectId(req.params.id)
            if(!_id){
                logger.error(`Salon Id is missing salon_id: ${d.salon_id} & mua_id: ${d.mua_id}`)
                res.status(403)
                res.send({ message: `Salon Id is missing salon_id: ${d.salon_id} & mua_id: ${d.mua_id}` })
                return
            }

            const service = await Service.create(d)
            const service_id = mongoose.Types.ObjectId(service._id)
            //@ts-ignore
            const newSalon = await Salon.findOneAndUpdate({_id, services: {$nin: [service_id]}}, { $push : {services  : service_id}}, {new: true}).populate("services").exec()
            if(newSalon === null){
                const errMsg = `Add Services: no data with this _id and service was found`
                logger.error(errMsg)
                res.status(403)
                res.send({ message: errMsg })
                return
            }
            console.log(newSalon)
            res.send(newSalon)
        }catch(e){
            logger.error(`${e.message}`)
            res.status(403)
            res.send({ message: `${CONFIG.RES_ERROR} ${e.message}` })
        }
    }
    
  deleteSalonService = async (req: Request, res: Response) => {
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
            const newSalon = await Salon.findOneAndUpdate({_id, services : {$in : [osid]}}, {$pull: {services : osid}}, {new: true})
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

    //associating salons to events
    addSalonEvent = async (req: Request, res: Response) => {
        try {
            const d: EventDesignerI = req.body
            const eventid= mongoose.Types.ObjectId(d.event_id)
            const designerId= mongoose.Types.ObjectId(d.designer_id)
            const designerEventReq =  Event.findOneAndUpdate({_id: eventid, designers: { $nin: [designerId] } }, {$push: {designers: designerId}}, {new: true})
            
            const newSalonReq = Salon.findOneAndUpdate({_id: designerId, events: { $nin: [eventid] } }, {$push: {events: eventid}}, {new: true})
            const [designerEvent, newDesigner] = await Promise.all([designerEventReq, newSalonReq])
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
            res.status(403)
            res.send({ message: `${CONFIG.RES_ERROR} ${e.message}` })
        }
    }

    
}
