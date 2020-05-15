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
import { vendorJWTVerification } from "../../middleware/VendorJwt"

export default class MakeupartistServiceC extends BaseService {

    constructor() {
        super(MakeupArtist)
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
            const ma: MakeupArtistI = req.body
            const makeupartist = await MakeupArtist.create(ma)
            //@ts-ignore
            const _id = mongoose.Types.ObjectId(decoded._id) 
            await Vendor.findOneAndUpdate({ _id }, { $push: { makeup_artists: makeupartist._id } })

            res.send(makeupartist)
        } catch (e) {
            logger.error(`${e.message}`)
            res.status(400)
            res.send({ message: `${CONFIG.RES_ERROR} ${e.message}` })
        }
    }

    patchMakeupArtist = async (req: Request, res: Response) => {
    
        try {
            const id = req.params.id
            if(!id){
                const errMsg = "MakeupArtist ID not found"
                logger.error(errMsg)
                res.status(400)
                res.send({ message: errMsg })
                return

            }

            const d = req.body
           
            const makeupartist = await MakeupArtist.findByIdAndUpdate(id,d,{new:true})
            res.send(makeupartist)

            
        } catch (error) {
            const errMsg = "MakeupArtist ID not found"
                logger.error(errMsg)
                res.status(400)
                res.send({ message: errMsg })
                return
            
        }
    
    
    }
    makeupArtistSettings = async (req: Request, res: Response) => {
        try {
            const makeupArtist_id = req.params.id

            if (!makeupArtist_id) {
                const errMsg = "MakeupArtist ID not found"
                logger.error(errMsg)
                res.status(400)
                res.send({ message: errMsg })
                return
            }
            const updates = Object.keys(req.body)
            const allowedupates = ["name", "location", "start_working_hours"]
            const isvalid = updates.every((update) => allowedupates.includes(update))



            if (!isvalid) {
                const errMsg = "Error updating MakeupArtist"
                logger.error(errMsg)
                res.status(400)
                res.send({ message: errMsg })
                return
            }
            const mua = await MakeupArtist.findById(makeupArtist_id)
            updates.forEach((update) => {

                mua[update] = req.body[update]

            })
            const updatedmua = await mua.save()
            //const updatedmua = await MakeupArtist.update({_id:makeupArtist_id},{$set:updates},{new:true})
            res.send(updatedmua)



        } catch (error) {
            const errMsg = "Error updating Makeupartist"
            logger.error(errMsg)
            res.status(400)
            res.send({ message: errMsg })
            return

        }


    }
}