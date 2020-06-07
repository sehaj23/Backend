
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
import BaseService from "../AdminService/base.service"
import { employeeJWTVerification } from "../../middleware/Employee.jwt"

export default class BookingService extends BaseService {

    constructor() {
        super(Booking)
    }

    getbookings = async (req: Request, res: Response) => {

        const q = req.query
        console.log(q)

        const pageNumber: number = parseInt(q.page_number || 1)
        let pageLength: number = parseInt(q.page_length || 25)
        pageLength = (pageLength > 100) ? 100 : pageLength
        const skipCount = (pageNumber - 1) * pageLength
        console.log(pageLength)
        console.log(skipCount)

        const keys = Object.keys(q)
        const filters = {}
        const dateFilter = {}



        // dateFilter["start_date"] = moment().subtract(1, "year").format("YYYY-MM-DD")
        // dateFilter["end_date"] = moment().add(1, "days").format("YYYY-MM-DD")
        for (const k of keys) {
            switch (k) {
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
                    filters["status"] = q[k]
                    break;
                //case "date":
                // filters["date_time"] = moment(q[k]).format("YYYY-MM-DD")
                // break
                case "salon_id":
                    filters["salon_id"] = q[k]
                    break;
                case "start_date":
                    dateFilter["start_date"] = moment(q[k]).format("YYYY-MM-DD").concat("T00:00:00.000Z")
                   
                    break
                case "end_date":
                    dateFilter["end_date"] = moment(q[k]).format("YYYY-MM-DD").concat("T23:59:59.000Z")
                    filters["date_time"] = {
                        "$gte": dateFilter["start_date"],
                        "$lt": dateFilter["end_date"]
                    }
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
            const bookingDetailsReq = Booking.find(filters).skip(skipCount).limit(pageLength).sort('-createdAt').populate("user_id").populate("services.employee_id").populate("services.service_id").exec()
            const bookingPagesReq = Booking.count(filters)
            const bookingStatsReq = Booking.find(filters).skip(skipCount).limit(pageLength).sort('-createdAt')


            const [bookingDetails, bookingStats, bookingPages] = await Promise.all([bookingDetailsReq, bookingStatsReq, bookingPagesReq])
            res.send({ bookingDetails, bookingStats, bookingPages })
            console.log({ bookingDetails,bookingStats,bookingPages })

        } catch (error) {
            const errMsg = "Error Bookingg not found"
            logger.error(errMsg)
            res.status(400)
            res.send({ message: errMsg })
            return

        }

    }
    getEmployeebookings = async (req: Request, res: Response) => {



        const q = req.query
        console.log(q)

        const pageNumber: number = parseInt(q.page_number || 1)
        let pageLength: number = parseInt(q.page_length || 25)
        pageLength = (pageLength > 100) ? 100 : pageLength
        const skipCount = (pageNumber - 1) * pageLength
        console.log(pageLength)
        console.log(skipCount)

        const keys = Object.keys(q)
        const filters = {}
        const dateFilter = {}
        const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
        //console.log(token)
        const decoded = await employeeJWTVerification(token)







        dateFilter["start_date"] = moment().subtract(28, "days").format("YYYY-MM-DD")
        dateFilter["end_date"] = moment().add(1, "days").format("YYYY-MM-DD")

        for (const k of keys) {
            switch (k) {
                case "service_id":
                    filters["services.service_id"] = {
                        "$in": q[k].split(",")
                    }
                    break
                case "status":
                    filters["status"] = q[k]
                    break;

                case "salon_id":
                    filters["salon_id"] = q[k]
                    break;
                case "start_date":
                    dateFilter["start_date"] = moment(q[k]).format("YYYY-MM-DD").concat("T00:00:00.000Z")
                    break
                case "end_date":
                    dateFilter["end_date"] = moment(q[k]).format("YYYY-MM-DD").concat("T23:59:59.000Z")
                    break
                case "page_number":
                case "page_length":

                    break
                default:
                    filters[k] = q[k]
            }

            filters["date_time"] = {
                "$gte": dateFilter["start_date"],
                "$lt": dateFilter["end_date"]
            }






        }
        filters["services.employee_id"] = {

            //@ts-ignore  
            "$in": decoded._id
        }
        console.log(filters);
        try {
            const bookingDetailsReq = Booking.find(filters).skip(skipCount).limit(pageLength).sort('-createdAt').populate("user_id").populate("services.employee_id").exec()
            const bookingPagesReq = Booking.count(filters)
            const bookingStatsReq = Booking.find(filters).skip(skipCount).limit(pageLength).sort('-createdAt')


            const [bookingDetails, bookingStats, bookingPages] = await Promise.all([bookingDetailsReq, bookingStatsReq, bookingPagesReq])
            res.send({ bookingDetails, bookingStats, bookingPages })
            console.log({ bookingPages })

        } catch (error) {
            const errMsg = "Error Bookingg not found"
            logger.error(errMsg)
            res.status(400)
            res.send({ message: errMsg })
            return

        }

    }
    rescheduleSlots = async (req: Request, res: Response) => {

        try {
            const id = mongoose.Types.ObjectId(req.params.id) // salon id
            const date = moment() || moment(req.query.date)
            const salon = await Salon.findById(id)
            
            const starting_hours = salon.start_working_hours
            var start_time = starting_hours.map(function (val) {
                return moment(val).format('YYYY-MM-DD hh:mm a');;
            })
            console.log(start_time)
            const end_hours = salon.end_working_hours
            var end_time = end_hours.map(function (val) {
                return moment(val).format('YYYY-MM-DD hh:mm a');;
            })
            const slots = []
            var time1 = start_time[date.day()]
            console.log(date)
            var time2 = end_time[date.day()]
            for (var m = moment(time1); m.isBefore(time2); m.add(30, 'minutes')) {
                slots.push(m.format('hh:mm a'));
            }
            res.send(slots)
            console.log(slots);
        } catch (error) {
            const errMsg = "Error in slots"
            logger.error(errMsg)
            res.status(400)
            res.send({ message: errMsg })
            return

        }
        

    }



    rescheduleBooking = async (req: Request, res: Response) => {

        try {
            const id = req.params.id

            const d = req.body.date_time
            console.log(d)
            console.log(req.body)
            const booking = await Booking.findByIdAndUpdate(id, { date_time: d,status:"Requested" }, { new: true })
            res.send(booking)

        } catch (error) {
            const errMsg = "Error in rescheduling"
            logger.error(errMsg)
            res.status(400)
            res.send({ message: errMsg })
            return
        }



    }
    updateStatusBookings = async (req: Request, res: Response) => {

        try {
            const bookingid = req.params.id
            const status = req.body.status
            console.log(bookingid);

            if (!bookingid) {
                const errMsg = 'Booking Id not found'
                logger.error(errMsg)
                res.status(400)
                res.send({ message: errMsg })
                return
            }
            if (!status) {
                const errMsg = 'status not found'
                logger.error(errMsg)
                res.status(400)
                res.send({ message: errMsg })
                return

            }
            const bookings = await Booking.findByIdAndUpdate({ _id: bookingid }, { status: status }, { new: true, runValidators: true }).populate("user_id").exec()

            res.send(bookings)

        } catch (error) {
            console.log(error)
            const errMsg = "Error updating Status"
            logger.error(errMsg)
            res.status(400)
            res.send({ message: errMsg })
            return
        }


    }






}