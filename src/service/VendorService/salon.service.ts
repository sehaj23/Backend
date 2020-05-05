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



export default class SalonService extends BaseService {

    constructor() {
        super(Salon)
    }

    post = async (req: Request, res: Response) => {
        try {
            const d: SalonI = req.body
            const salon = await Salon.create(d)
            const _id = salon.vendor_id
            await Vendor.findOneAndUpdate({ _id }, { $push: { salons: salon._id } })
            res.send(salon)
        } catch (e) {
            logger.error(`${e.message}`)
            res.status(403)
            res.send({ message: `${CONFIG.RES_ERROR} ${e.message}` })
        }
    }
    SalonSettings = async (req: Request, res: Response) => {
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
}