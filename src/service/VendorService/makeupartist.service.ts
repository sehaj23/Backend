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
import Service from "../../models/service.model";
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
}