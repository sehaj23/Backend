import Booking from "../../models/booking.model"
import { Request, Response } from "express"
import { BookingI } from "../../interfaces/booking.interface"
import logger from "../../utils/logger"
import mongoose from "../../database"
import * as moment from "moment"
import { filter } from "bluebird"


export default class RevenueService {
    revenue = async (req: Request, res: Response) => {

        const q = req.query
        console.log(q)

        // if(!q.makeup_artist_id && !q.designer_id && !q.salon_id){
        //     const message = 'None id provided'
        //     res.status(400)
        //     res.send({message})
        //     return
        // }

        // pagination
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
        filters["createdAt"] = {
            "$gte": dateFilter["start_date"],
            "$lt": dateFilter["end_date"]
        }
        console.log(filters);
    
        
        try{
            const revenueDetailsReq =  Booking.find(filters).skip(skipCount).limit(pageLength).sort('-createdAt')
            const revenuePagesReq = Booking.count(filters)
            const revenueStatsReq =  Booking.aggregate([
                {$match: {...filters}},
                { $project : {
                    price : 1 ,
                    services: 1
                }},
                { $unwind: "$services" },
                { 
                    $group: {
                        _id: null,
                        price: {
                            $sum: "$price",
                        },
                        zattire_commission: {
                            $sum: "$services.zattire_commission"
                        },
                        vendor_commission: {
                            $sum: "$services.vendor_commission"
                        },
                        total: {
                            $sum: {
                                $add : ["$services.zattire_commission", "$services.vendor_commission"]
                            }
                        }
                    }
                },
            ]).skip(skipCount).limit(pageLength).sort('-createdAt')
            const [revenueDetails, revenueStats, revenuePages] = await Promise.all([revenueDetailsReq, revenueStatsReq, revenuePagesReq])
            const totalPages = Math.ceil(revenuePages / pageLength)
            res.send({revenueDetails, revenueStats, totalPages, currentPage: pageNumber})
        }catch(e){
            console.log(e)
            res.status(400)
            res.send({message: e.message})
        }        


        return;     

    }
    totalRevenue = async (req: Request, res: Response) => {
        const revenue = await Booking.aggregate([
            { $unwind: '$services' },
            { $match: { status: "Completed" } },
            { $group: { _id: null, price: { $sum: "$price" }, zattire_commission: { $sum: "$services.zattire_commission" }, vendor_commission: { $sum: "$services.vendor_commission" } } }
        ])

        res.send(revenue)


    }
    revenueByBookingId = async (req: Request, res: Response) => {
        const id = req.params.id
        const q = req.query
       
        

        // if(!q.makeup_artist_id && !q.designer_id && !q.salon_id){
        //     const message = 'None id provided'
        //     res.status(400)
        //     res.send({message})
        //     return
        // }

        // pagination
        const pageNumber: number = parseInt( q.page_number || 1)
        let pageLength: number = parseInt(q.page_length || 25)
        pageLength = (pageLength > 100) ? 100 : pageLength
        const skipCount = (pageNumber - 1) * pageLength
        // console.log(pageLength)
        // console.log(skipCount)
        
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
                case "start_date":
                    dateFilter["start_date"] = moment(q[k]).format("YYYY-MM-DD")
                    break
                case "end_date":
                    dateFilter["end_date"] = moment(q[k]).format("YYYY-MM-DD")
                    break
                case "page_number":  

                    break;
                default:
                    filters[k] = q[k]
            }
        }
        filters["_id"] = id
        filters["createdAt"] = {
            "$gte": dateFilter["start_date"],
            "$lt": dateFilter["end_date"]
        }
        // console.log(filters);
        // console.log(pageLength)
        
        try{
            const revenueDetailsReq =  Booking.find(filters).skip(skipCount).limit(pageLength).sort('-createdAt')
            const revenuePagesReq = Booking.count(filters)
            const revenueStatsReq =  Booking.aggregate([
                {$match: {...filters}},
                { $project : {
                    price : 1 ,
                    services: 1
                }},
                { $unwind: "$services" },
                { 
                    $group: {
                        _id: null,
                        price: {
                            $sum: "$price",
                        },
                        zattire_commission: {
                            $sum: "$services.zattire_commission"
                        },
                        vendor_commission: {
                            $sum: "$services.vendor_commission"
                        },
                        total: {
                            $sum: {
                                $add : ["$services.zattire_commission", "$services.vendor_commission"]
                            }
                        }
                    }
                },
            ]).skip(skipCount).limit(pageLength).sort('-createdAt')
            const [revenueDetails, revenueStats, revenuePages] = await Promise.all([revenueDetailsReq, revenueStatsReq, revenuePagesReq])
            const totalPages = Math.ceil(revenuePages / pageLength)
            res.send({revenueDetails, revenueStats, totalPages, currentPage: pageNumber})

        }catch(e){
            console.log(e)
            res.status(400)
            res.send({message: e.message})
        }        


        return;




    }
}
