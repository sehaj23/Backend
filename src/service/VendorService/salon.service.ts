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
}