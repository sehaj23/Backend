import Booking from "../../models/booking.model"
import { Request, Response } from "express"
import { BookingI } from "../../interfaces/booking.interface"
import logger from "../../utils/logger"
import mongoose from "../../database"
import * as moment from "moment"


export default class RevenueService{
    get = async (req: Request, res: Response) => {
        try {
           
           
     const pageOptions = {
                start: req.query.startdate || moment().subtract('28',"days").format('YYYY,MM,DD'),
                last : req.query.lastdate || moment().format('YYYY,MM,DD'),
                page: parseInt(req.query.page, 10) || 0,
                limit: parseInt(req.query.limit, 10) || 10
            }
           
            
            // find the total of the revenue 
            // const today = moment().format('YYYY,MM,DD')
            //const before = moment().subtract('28',"days").format('YYYY,MM,DD')
            //console.log(before)
            
            // const revenue = await Booking.aggregate([
            //     { $match: { status:"Completed",date_time:{"$gte":new Date(before), "$lt":new Date(today)}}},
            //     { $group: { _id: null, price: { $sum: "$price" } } }
               

            // ])
            const revenue  = await Booking.find({date_time: {"$gte": new Date(pageOptions.start), "$lt": new Date(pageOptions.last)}}).limit(pageOptions.limit).skip(pageOptions.page * pageOptions.limit)
            if(!revenue){
                const errMsg = "No Bookings found"
                logger.error(errMsg)
                res.status(400)
                res.send({ message: errMsg })
                return
            }
            res.send(revenue)
            
        } catch (error) {
            const errMsg = "No Bookings found"
            logger.error(errMsg)
            res.status(400)
            res.send({ message: errMsg })
            return
        }
    
    }

} 