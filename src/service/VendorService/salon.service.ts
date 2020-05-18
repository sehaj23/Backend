import { Router, Request, Response } from "express";
import CONFIG from "../../config";
import logger from "../../utils/logger";
import Event from "../../models/event.model";
import EventDesignerI from "../../interfaces/eventDesigner.model";
import mongoose from "../../database";
import BaseService from "./base.service";
import { DesignersI } from "../../interfaces/designer.interface";
import Vendor from "../../models/vendor.model";
import Salon from "../../models/salon.model";
import { SalonI } from "../../interfaces/salon.interface";
import ServiceI from "../../interfaces/service.interface";
import Service from "../../models/service.model";
import { EmployeeI } from "../../interfaces/employee.interface";
import Employee from "../../models/employees.model";
import Offer from "../../models/offer.model";
import { vendorJWTVerification } from "../../middleware/VendorJwt"



export default class SalonService extends BaseService {

    constructor() {
        super(Salon)
    }

    post = async (req: Request, res: Response) => {
        try {
            const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
            if (!token) {
                logger.error("No token provided.")
                res.status(401).send({ success: false, message: 'No token provided.' });
                return
            }
            const decoded = await vendorJWTVerification(token)
            if (decoded === null) {
                logger.error("Something went wrong")
                res.status(401).send({ success: false, message: 'Something went wrong' });
                return
            }
            //@ts-ignore
            req.body.vendor_id = decoded._id
            const d: SalonI = req.body
            const salon = await Salon.create(d)
            //@ts-ignore
            const _id = mongoose.Types.ObjectId(decoded._id)
            await Vendor.findOneAndUpdate({ _id }, { $push: { salons: salon._id } })
            res.send(salon)
        } catch (e) {
            logger.error(`${e.message}`)
            res.status(403)
            res.send({ message: `${CONFIG.RES_ERROR} ${e.message}` })
        }
    }

    patchSalon = async (req: Request, res: Response) => {

        try {
            const id = req.params.id
            if (!id) {
                const errMsg = "Salon ID not found"
                logger.error(errMsg)
                res.status(400)
                res.send({ message: errMsg })
                return

            }

            const d = req.body

            const salon = await Salon.findByIdAndUpdate(id, d, { new: true })
            res.send(salon)


        } catch (error) {
            const errMsg = "Salon  not found"
            logger.error(errMsg)
            res.status(400)
            res.send({ message: errMsg })
            return

        }


    }

    salonSettings = async (req: Request, res: Response) => {
        try {
            const Salon_id = req.params.id

            if (!Salon_id) {
                const errMsg = "Salon id not found"
                logger.error(errMsg)
                res.status(400)
                res.send({ message: errMsg })
                return
            }
            const updates = Object.keys(req.body)
            const allowedupates = ["name", "location", "start_working_hours"]
            const isvalid = updates.every((update) => allowedupates.includes(update))



            if (!isvalid) {
                const errMsg = "Error updating Salon"
                logger.error(errMsg)
                res.status(400)
                res.send({ message: errMsg })
                return
            }
            const salon = await Salon.findById(Salon_id)
            updates.forEach((update) => {

                salon[update] = req.body[update]

            })
            const updatedsalon = await salon.save()
            //const updatedesigner = await Designer.update({_id:designer_id},{$set:updates},{new:true})
            res.send(updatedsalon)



        } catch (error) {
            const errMsg = "Error updating Salon"
            logger.error(errMsg)
            res.status(400)
            res.send({ message: errMsg })
            return

        }


    }
    addSalonService = async (req: Request, res: Response) => {
        console.log(req.body.services)
        try {
            const d:ServiceI = req.body.services

            const _id = mongoose.Types.ObjectId(req.params.id)
            if (!_id) {
                logger.error(`Salon Id is missing salon_id: ${d.salon_id} & mua_id: ${d.mua_id}`)
                res.status(403)
                res.send({ message: `Salon Id is missing salon_id: ${d.salon_id} & mua_id: ${d.mua_id}` })
                return
            }

            const service = await Service.create(d)
            const service_id = mongoose.Types.ObjectId(service._id)
            //@ts-ignore
            var result = service.map(service_id => ({ _id: mongoose.Types.ObjectId(service_id.id) }));
           

            //@ts-ignore
            const newSalon = await Salon.findOneAndUpdate({ _id, services: { $nin: [service_id] } }, { $push: { services: { $each: result } } }, { new: true }).populate("services").exec()
            if (newSalon === null) {
                const errMsg = `Add Services: no data with this _id and service was found`
                logger.error(errMsg)
                res.status(403)
                res.send({ message: errMsg })
                return
            }
            console.log(newSalon)
            res.send(newSalon)
        } catch (e) {
            logger.error(`${e.message}`)
            res.status(403)
            res.send({ message: `${CONFIG.RES_ERROR} ${e.message}` })
        }
    }
    deleteSalonService = async (req: Request, res: Response) => {
        try {
            const sid = req.params.sid
            const _id = req.params.id
            if (!_id || !sid) {
                logger.error(`Salon Id is missing salon_id:  & mua_id: `)
                res.status(403)
                res.send({ message: `Salon Id is missing salon_id: ` })
                return
            }
            const osid = mongoose.Types.ObjectId(sid)


            // @ts-ignore
            const newSalon = await Salon.findOneAndUpdate({ _id, services: { $in: [osid] } }, { $pull: { services: osid } }, { new: true })
            if (newSalon === null) {
                const errMsg = `Delete Service: no data with this _id and service was found`
                logger.error(errMsg)
                res.status(403)
                res.send({ message: errMsg })
                return
            }
            res.send(newSalon)
        } catch (e) {
            logger.error(`${e.message}`)
            res.status(403)
            res.send({ message: `${CONFIG.RES_ERROR} ${e.message}` })
        }

    }
    getService = async (req: Request, res: Response) => {
        try {
            const id = req.params.id
            if (!id) {
                const errMsg = `id is missing from the params`
                logger.error(errMsg)
                res.status(400)
                res.send({ message: errMsg })
                return
            }
            const monogId = mongoose.Types.ObjectId(id)
            //@ts-ignore
            const services = await Salon.find({ _id: monogId }).select("services").populate("services").exec()
            if (services === null) {
                const errMsg = `no service found`
                logger.error(errMsg)
                res.status(400)
                res.send({ message: errMsg })
                return
            }
            res.send(services)
        } catch (e) {
            logger.error(`Booking service ${e.message}`)
            res.status(403)
            res.send({ message: `${e.message}` })
        }
    }


}