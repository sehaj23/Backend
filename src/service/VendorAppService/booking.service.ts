
import Booking from "../../models/booking.model"
import Salon from "../../models/salon.model"
import { Request, Response } from "express"
import { BookingI } from "../../interfaces/booking.interface"
import logger from "../../utils/logger"
import mongoose from "../../database"
import Service from "../../models/service.model"
import { ServiceSI } from "../../interfaces/service.interface"
import Offer from "../../models/offer.model"
import * as moment from "moment"
import Employee from "../../models/employees.model"
import Photo from "../../models/photo.model"

export default class BookingService{
    getbookings = async (req: Request, res: Response) => {

    const q = req.query
    console.log(q)

    const pageNumber: number = parseInt( q.page_number || 1)
    let pageLength: number = parseInt(q.page_length || 25)
    pageLength = (pageLength > 100) ? 100 : pageLength
    const skipCount = (pageNumber - 1) * pageLength
    console.log(pageLength)
    console.log(skipCount)

    const keys = Object.keys(q)
    const filters = {}
    const dateFilter = {}
    dateFilter["start_date"] = moment().subtract(28, "days").format("YYYY-MM-DD")
    dateFilter["end_date"] = moment().add(1, "days").format("YYYY-MM-DD")
    for (const k of keys) {
        switch(k){
            case "service_id":
                filters["services.service_id"] = {
                    "$in": q[k].split(",")
                } 
                break
            case "employee_id":
                filters["services.employee_id"] = {
                    "$in": q[k].split(",")
                } 
                break
            case "status":
                filters["status"]= q[k]
            case "start_date":
                dateFilter["start_date"] = moment(q[k]).format("YYYY-MM-DD")
                break
            case "end_date":
                dateFilter["end_date"] = moment(q[k]).format("YYYY-MM-DD")
                break
            case "page_number":
            case "page_length":
                
                break
            default:
                filters[k] = q[k]
        }
    

    }
    console.log(filters);
        try {
            const bookingDetailsReq =  Booking.find(filters).skip(skipCount).limit(pageLength).sort('-createdAt')
            const bookingPagesReq = Booking.count(filters)
            const bookingStatsReq =  Booking.find(filters).skip(skipCount).limit(pageLength).sort('-createdAt')
                
           
            const [bookingDetails, bookingStats, bookingPages] = await Promise.all([bookingDetailsReq, bookingStatsReq, bookingPagesReq])
            res.send({bookingDetails, bookingStats, bookingPages})
            
        } catch (error) {
            const errMsg = "Error Bookingg not found"
            logger.error(errMsg)
            res.status(400)
            res.send({ message: errMsg })
            return
            
        }

    }


}