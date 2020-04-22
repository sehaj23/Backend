import BaseService from "./base.service"
import Booking from "../models/booking.model"
import { Request, Response } from "express"
import { BookingI } from "../interfaces/booking.interface"
import logger from "../utils/logger"


export default class BookinkService extends BaseService{

    constructor(){
        super(Booking)
    }

    post = async (req: Request, res: Response) => {
        const d: BookingI = req.body
        if(!d.salon_id && !d.makeup_artist_id && !d.designer_id){
            const errMsg = `Atleast one provider is is reqired out of 3`
            logger.error(errMsg)
            res.status(400)
            res.send({message: errMsg})
            return
        }
        try {
           
            const e = req.body

            const event = await Booking.create(e)

            res.send(event)
        } catch (e) {
            logger.error(`Post ${e.message}`)
            res.status(403)
            res.send({ message: `${e.message}` })
        }

    }

}