import BaseService from "./base.service"
import Booking from "../models/booking.model"
import { Request, Response } from "express"
import { BookingI } from "../interfaces/booking.interface"
import logger from "../utils/logger"
import mongoose from "../database"


export default class BookinkService extends BaseService{

    constructor(){
        super(Booking)
    }

    post = async (req: Request, res: Response) => {
        try {
            const e = req.body
           
            if(!e.salon_id && !e.makeup_artist_id && !e.designer_id){
                const errMsg = `Atleast one provider is is reqired out of 3`
                logger.error(errMsg)
                res.status(400)
                res.send({message: errMsg})
                return
            }

            if(e.salon_id){
                e.salon_id = mongoose.Types.ObjectId(e.salon_id)
            }
            if(e.makeup_artist_id){
                e.makeup_artist_id = mongoose.Types.ObjectId(e.makeup_artist_id)
            }
            if(e.designer_id){
                e.designer_id = mongoose.Types.ObjectId(e.designer_id)
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