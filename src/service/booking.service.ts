import BaseService from "./base.service"
import Booking from "../models/booking.model"
import { Request, Response } from "express"
import { BookingI } from "../interfaces/booking.interface"
import logger from "../utils/logger"
import mongoose from "../database"
import Service from "../models/service.model"
import { ServiceSI } from "../interfaces/service.interface"
import Offer from "../models/offer.model"


export default class BookinkService extends BaseService{

    constructor(){
        super(Booking)
    }

    post = async (req: Request, res: Response) => {
        try {
            const e: BookingI = req.body
           
            if(!e.salon_id && !e.makeup_artist_id && !e.designer_id){
                const errMsg = `Atleast one provider is is reqired out of 3`
                logger.error(errMsg)
                res.status(400)
                res.send({message: errMsg})
                return
            }

            // if(e.salon_id){
            //     e.salon_id = mongoose.Types.ObjectId(e.salon_id.toString())
            // }
            // if(e.makeup_artist_id){
            //     e.makeup_artist_id = mongoose.Types.ObjectId(e.makeup_artist_id.toString())
            // }
            // if(e.designer_id){
            //     e.designer_id = mongoose.Types.ObjectId(e.designer_id.toString())
            // }

            const {services} = e
            if(!services){
                const errMsg = `Services not defined`
                logger.error(errMsg)
                res.status(400)
                res.send({message: errMsg})
                return
            }

            if(services.length === 0){
                const errMsg = `Atleast one services is required. Length is 0`
                logger.error(errMsg)
                res.status(400)
                res.send({message: errMsg})
                return
            }

            const serviceIds = []
            for(let s of services){
                if(s.service_id){
                    if(!s.service_time){
                        const errMsg = `Service time not found for id: ${s.service_id}`
                        logger.error(errMsg)
                        res.status(400)
                        res.send({message: errMsg})
                        return
                    }
                    serviceIds.push(mongoose.Types.ObjectId(s.service_id))
                }else{
                    const errMsg = `Service Id not found: 22`
                    logger.error(errMsg)
                    res.status(400)
                    res.send({message: errMsg})
                    return
                }
            }

            if(serviceIds.length === 0){
                const errMsg = `Service Ids not found`
                logger.error(errMsg)
                res.status(400)
                res.send({message: errMsg})
                return
            }


            const serviceInfoReq = Service.find({_id: {$in: serviceIds}})
            const offerInfoReq = Offer.find({service_id: {$in: serviceIds}})
            const [serviceInfo, offerInfo] = await Promise.all([serviceInfoReq, offerInfoReq])

            if(serviceInfo.length === 0){
                const errMsg = `serviceInfo not found`
                logger.error(errMsg)
                res.status(400)
                res.send({message: errMsg})
                return
            }

            for(let offer of offerInfo){
                for(let service of serviceInfo){
                    if(offer._id === service._id){
                        // TODO: 
                    }
                }
            }



            const event = await Booking.create(e)

            res.send(event)
        } catch (e) {
            logger.error(`Post ${e.message}`)
            res.status(403)
            res.send({ message: `${e.message}` })
        }

    }

}