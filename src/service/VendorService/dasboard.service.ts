import { Request, Response } from "express"
import Booking from "../../models/booking.model"
import moment = require("moment")
import logger from "../../utils/logger"

export default class DashboardService {

    customerCount = async (req: Request, res: Response) => {

        const q = req.query
        console.log(q)

        // if(!q.makeup_artist_id && !q.designer_id && !q.salon_id){
        //     const message = 'None id provided'
        //     res.status(400)
        //     res.send({message})
        //     return
        // }

        try {
            const keys = Object.keys(q)
            const filters = {}
            const dateFilter = {}
            dateFilter["start_date"] = moment().subtract(28, "days").format("YYYY-MM-DD")
            dateFilter["end_date"] = moment().add(1, "days").format("YYYY-MM-DD")
            filters["createdAt"] = {
                "$gte": dateFilter["start_date"],
                "$lt": dateFilter["end_date"]
            }
            const customer = await Booking.find(filters).distinct("user_id")
            const customerCount= customer.length
            res.send({customerCount})
        } catch (error) {
            const message = error.message
            console.log(error)
            logger.error(message)
            res.status(400).send({message})
        }

    }

}