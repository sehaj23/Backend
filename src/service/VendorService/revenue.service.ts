import Booking from "../../models/booking.model"
import { Request, Response } from "express"
import { BookingI } from "../../interfaces/booking.interface"
import logger from "../../utils/logger"
import mongoose from "../../database"
import * as moment from "moment"


export default class RevenueService {
    revenue = async (req: Request, res: Response) => {

        try {
            const pageOptions = {
                start: req.query.startdate || moment().subtract('28', "days").format('YYYY,MM,DD'),
                last: req.query.lastdate || moment().format('YYYY,MM,DD'),
                page: parseInt(req.query.page, 10) || 0,
                limit: parseInt(req.query.limit, 10) || 10,

            }
            const check = {}

            if ((req.query.service) || (req.query.employee_id)) {
                if (req.query.service) {
                    //@ts-ignore
                    check.services = { "services.service_name": { $in: req.query.service } }
                    console.log(req.query.service)

                }
                if (req.query.employee_id) {
                    //@ts-ignore
                    check.employee_id = req.query.employee_id

                }
                const revenue = await Booking.aggregate([

                    { $unwind: '$services' },
                    { $match: { "services.service_name": { $in: req.query.service, status: "Completed", date_time: { "$gte": new Date(pageOptions.start), "$lt": new Date(pageOptions.last) } } } },
                    { $group: { _id: null, price: { $sum: "$price" }, zattire_commission: { $sum: "$services.zattire_commission" }, vendor_commission: { $sum: "$services.vendor_commission" } } }


                ])
                if (!revenue) {
                    const errMsg = "No Bookings found"
                    logger.error(errMsg)
                    res.status(400)
                    res.send({ message: errMsg })
                    return
                }
                return res.send(revenue)



            }





            // find the total of the revenue 
            // const today = moment().format('YYYY,MM,DD')
            // const before = moment().subtract('28',"days").format('YYYY,MM,DD')
            // console.log(before)

            const revenue = await Booking.aggregate([
                { $unwind: '$services' },
                { $match: { status: "Completed", date_time: { "$gte": new Date(pageOptions.start), "$lt": new Date(pageOptions.last) } } },
                { $group: { _id: null, price: { $sum: "$price" }, zattire_commission: { $sum: "$services.zattire_commission" }, vendor_commission: { $sum: "$services.vendor_commission" } } }


            ])
            //  const revenue  = await Booking.find({date_time: {"$gte": new Date(pageOptions.start), "$lt": new Date(pageOptions.last)}}).limit(pageOptions.limit).skip(pageOptions.page * pageOptions.limit)
            if (!revenue) {
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
    totalRevenue = async (req: Request, res: Response) => {
        const revenue = await Booking.aggregate([
            { $unwind: '$services' },
            { $match: { status: "Completed" } },
            { $group: { _id: null, price: { $sum: "$price" }, zattire_commission: { $sum: "$services.zattire_commission" }, vendor_commission: { $sum: "$services.vendor_commission" } } }
        ])

        res.send(revenue)


    }




} 