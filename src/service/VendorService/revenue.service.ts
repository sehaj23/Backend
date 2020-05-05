import Booking from "../../models/booking.model"
import { Request, Response } from "express"
import { BookingI } from "../../interfaces/booking.interface"
import logger from "../../utils/logger"
import mongoose from "../../database"


export default class RevenueService{
    get = async (req: Request, res: Response) => {
        try {
            const revenue = Booking.aggregate([
                { $match: { status:"Completed" } },
                { $group: { _id: null, price: { $sum: "$price" } } }
               

            ])
            res.send(revenue)
            
        } catch (error) {
            
        }
    
    }

} 