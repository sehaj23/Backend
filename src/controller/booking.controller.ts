import BaseController from "./base.controller";
import BookingService from "../service/booking.service";
import { Request, Response } from "express";
import controllerErrorHandler from "../middleware/controller-error-handler.middleware";
import encryptData from "../utils/password-hash";
import logger from "../utils/logger";
import moment = require("moment");
import mongoose from "../database";
import SalonService from "../service/salon.service";
import ErrorResponse from "../utils/error-response";
import EmployeeAbsenteesmService from "../service/employee-absentism.service";
import SalonSI from "../interfaces/salon.interface";
import { BookingI, BookingServiceI, BookingSI } from "../interfaces/booking.interface";


export default class BookingController extends BaseController {

    ZATTIRE_COMMISSION_PECENT = 20

    service: BookingService
    salonService: SalonService
    employeeAbsentismService: EmployeeAbsenteesmService
    constructor(service: BookingService, salonService: SalonService, employeeAbsentismService: EmployeeAbsenteesmService) {
        super(service)
        this.service = service
        this.salonService = salonService
        this.employeeAbsentismService = employeeAbsentismService
    }


    getAppointment = controllerErrorHandler(async (req: Request, res: Response) => {
        //@ts-ignore
        const bookings = await this.service.getByUserId(req.userId)
        res.send(bookings)
    })

    /**
     * @description book the the appointment with the salon
     */
    bookAppointment = controllerErrorHandler(async (req: Request, res: Response) => {

        const d = {
            "booking_date_time": "11-28-2020 04:50am",
            "payment_type": "COD or Online",
            "location": "'Customer Place' | 'Vendor Place'",
            "services": [{
                "service_id": "",
                "option_id": "",
                "employee_id": ""
            }]
        }
        const gotServices = req.body.services as {service_id: string, option_id: string, employee_id?: string}[]
        //@ts-ignore
        const userId = req.userId

        // getting the salon 
        const sanlon = await this.salonService.getServiceByServiceId(gotServices[0].service_id) as SalonSI
        let totalPrice = 0
        let totalTime = 0 // in mins

        const finalServices: BookingServiceI[] = []
        for(let service of sanlon.services){
            for(let i = 0; i < gotServices.length; i++){
                const ser = gotServices[i]
                //@ts-ignore
                if(service._id.toString() === ser.service_id){
                    let found = false
                    for(let option of service.options){
                        //@ts-ignore
                        if(option._id.toString() === ser.option_id){

                            const price = option.duration.valueOf()
                            const zattire_commission = price * (this.ZATTIRE_COMMISSION_PECENT/100)
                            const vendor_commission = price - zattire_commission
                            const bookinService: BookingServiceI = {
                                //@ts-ignore
                                service_id: ser.option_id.toString(),
                                option_id: ser.option_id,
                                service_name: `${service.name} ${option.option_name}`,
                                service_real_price: option.price.valueOf(),
                                service_total_price: option.price.valueOf(),
                                service_time: req.body.booking_date_time,
                                zattire_commission,
                                vendor_commission
                            }
                            finalServices.push(bookinService)

                            totalPrice += option.price.valueOf()
                            totalTime += option.duration.valueOf()
                            found = true
                            break
                        }
                    }
                    if(!found) throw new ErrorResponse(`Service id and option id does not match for service id: ${ser.service_id}`)
                }
            }
        }

        if(totalPrice === 0) throw new ErrorResponse(`Total price cannot be 0.`)
        if(finalServices.length === 0) throw new ErrorResponse("Final services array cannot be of length 0.")

        const b: BookingI = {
            user_id: userId,
            price: totalPrice,
            date_time: req.body.booking_date_time,
            payment_type: req.body.payment_type,
            location: req.body.location,
            services: finalServices,
            salon_id:req.body.salon_id
        }

        const booking = await this.service.post(b) as BookingSI
        
        return res.send(booking)
    })

    getSalonEmployees = controllerErrorHandler(async (req: Request, res: Response) => {

        if (!req.params.salonId) {
            const errMsg = `Salon Id not found`;
            logger.error(errMsg);
            res.status(400);
            res.send({ message: errMsg });
            return;
        }
        if (!req.query.dateTime) {
            const errMsg = `dateTime not found`;
            logger.error(errMsg);
            res.status(400);
            res.send({ message: errMsg });
            return
        }
        const salon = await this.service.getSalonEmployees(req.params.salonId, new Date(req.query.dateTime as string) )
        if (salon === null) {
            const errMsg = `salon not found`;
            logger.error(errMsg);
            res.status(400);
            res.send({ message: errMsg });
        }
        res.send(salon);

    })

    getSalonBookings = controllerErrorHandler(async (req: Request, res: Response) => {
        if (!req.params.id) {
            const errMsg = 'Salon Id not found'
            logger.error(errMsg)
            res.status(400)
            res.send({ message: errMsg })
            return
        }
        const booking = await this.service.getSalonBookings(req.params.id)
        if (booking === null) {
            const errMsg = 'No Bookings Found'
            logger.error(errMsg)
            res.status(400)
            res.send({ message: errMsg })
            return

        }
        res.status(200).send(booking)



    })
    getmakeupArtistBookings = controllerErrorHandler(async (req: Request, res: Response) => {
        const makeupArtistId = req.params.id
        if (!makeupArtistId) {
            const errMsg = 'Makeup Artist ID not found'
            logger.error(errMsg)
            res.status(400)
            res.send({ message: errMsg })
            return
        }
        const bookings = await this.service.getmakeupArtistBookings(makeupArtistId)
        if (bookings == null) {
            const errMsg = 'No Bookings Found'
            logger.error(errMsg)
            res.status(400)
            res.send({ message: errMsg })
            return
        }
        res.status(200).send(bookings)


    })
    getDesignerBookings = controllerErrorHandler(async (req: Request, res: Response) => {
        const designerId = req.params.id
        if (!designerId) {
            const errMsg = 'Designer Id not found'
            logger.error(errMsg)
            res.status(400)
            res.send({ message: errMsg })
            return
        }
        const bookings = await this.service.getDesignerBookings(designerId)

        if (bookings === null) {
            const errMsg = 'No Bookings Found'
            logger.error(errMsg)
            res.status(400)
            res.send({ message: errMsg })
            return

        }
        res.status(200).send(bookings)
    })

    getPendingSalonBookings = controllerErrorHandler(async (req: Request, res: Response) => {
        const salonId = req.params.id
        if (!salonId) {
            const errMsg = 'Salon Id not found'
            logger.error(errMsg)
            res.status(400)
            res.send({ message: errMsg })
            return
        }
        const bookings = await this.service.getPendingSalonBookings(salonId)
        if (bookings == null) {
            const errMsg = 'No Bookings Found'
            logger.error(errMsg)
            res.status(400)
            res.send({ message: errMsg })
            return
        }
        res.send(bookings)
    })
    getPendingmakeupArtistBookings = controllerErrorHandler(async (req: Request, res: Response) => {

        const makeupArtistId = req.params.id
        if (!makeupArtistId) {
            const errMsg = 'Makeup Artist ID not found'
            logger.error(errMsg)
            res.status(400)
            res.send({ message: errMsg })
            return
        }
        const bookings = await this.service.getPendingmakeupArtistBookings(makeupArtistId)
        if (!bookings) {
            const errMsg = 'No Bookings Found'
            logger.error(errMsg)
            res.status(400)
            res.send({ message: errMsg })
            return

        }
        res.status(200).send(bookings)
    })

    getPendingDesignerBookings = controllerErrorHandler(async (req: Request, res: Response) => {
        const designerId = req.params.id
        if (!designerId) {
            const errMsg = 'Designer Id not found'
            logger.error(errMsg)
            res.status(400)
            res.send({ message: errMsg })
            return
        }
        const bookings = await this.service.getPendingDesignerBookings(designerId)
        if (!bookings) {
            const errMsg = 'No Bookings Found'
            logger.error(errMsg)
            res.status(400)
            res.send({ message: errMsg })
            return

        }
        res.status(200).send(bookings)

    })
    updateStatusBookings = controllerErrorHandler(async (req: Request, res: Response) => {
        const bookingid = req.params.id
        const status = req.body.status

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
        const booking = this.service.updateStatusBookings(bookingid, status)
        if (!booking) {
            const errMsg = 'No Bookings Found'
            logger.error(errMsg)
            res.status(400)
            res.send({ message: errMsg })
            return

        }
        res.send(booking)

    })
    assigneEmployeeBookings = controllerErrorHandler(async (req: Request, res: Response) => {
        const bookingId = req.params.id
        const employeeId = req.body.employee_id
        const serviceName = req.body.service_name
        if (!bookingId) {
            const errMsg = 'Booking  not found'
            logger.error(errMsg)
            res.status(400)
            res.send({ message: errMsg })
            return
        }
        if (!employeeId || !serviceName) {
            const errMsg = 'Employee Id or Service Name not found'
            logger.error(errMsg)
            res.status(400)
            res.send({ message: errMsg })
            return

        }
        const booking = await this.service.assigneEmployeeBookings(bookingId, serviceName, employeeId)
        if (!booking) {
            const errMsg = 'No Bookings Found'
            logger.error(errMsg)
            res.status(400)
            res.send({ message: errMsg })
            return
        }
        res.send(booking)

    })
    getbookings = controllerErrorHandler(async (req: Request, res: Response) => {
        const q = req.query
        //TODO:Validator
        // if (!q.makeup_artist_id && !q.designer_id && !q.salon_id) {
        //     const message = 'None id provided'
        //     res.status(400)
        //     res.send({ message })
        //     return
        // }
        const bookings = await this.service.getbookings(q)
        if (!bookings) {
            const errMsg = 'No Bookings Found'
            logger.error(errMsg)
            res.status(400)
            res.send({ message: errMsg })
            return

        }
        res.send(bookings)

    })
    reschedulebooking = controllerErrorHandler(async (req: Request, res: Response) => {
        const id = req.params.id
        const date_time = req.body.date_time

        const date = moment().format('YYYY-MM-DD, h:mm:ss a')

        console.log(date)
        if (date_time < date) {
            const errMsg = "Cannot reschedule for past dates!"
            logger.error(errMsg)
            res.status(400)
            res.send({ message: errMsg })
            return
        }
        if (!id) {
            const errMsg = "Error Booking not found"
            logger.error(errMsg)
            res.status(400)
            res.send({ message: errMsg })
            return
        }
        const booking = await this.service.reschedulebooking(id, date_time)
        if (booking === null) {
            const errMsg = "unable to update boooking"
            logger.error(errMsg)
            res.status(400)
            res.send({ message: errMsg })
            return

        }
        res.status(200).send(booking)

    })
    getAllMuaBookings = controllerErrorHandler(async (req: Request, res: Response) => {
        const makeupArtistId = req.params.id
        if (!makeupArtistId) {
            const errMsg = 'Makeup Artist ID not found'
            logger.error(errMsg)
            res.status(400)
            res.send({ message: errMsg })
            return
        }
        const booking = this.service.getAllMuaBookings(makeupArtistId)
        if (booking == null) {
            const errMsg = 'No Bookings Found'
            logger.error(errMsg)
            res.status(400)
            res.send({ message: errMsg })
            return

        }
        res.status(200).send(booking)
    })
    getAllSalonBookings = controllerErrorHandler(async (req: Request, res: Response) => {
        const salonId = req.params.id
        if (!salonId) {
            const errMsg = 'Salon Id not found'
            logger.error(errMsg)
            res.status(400)
            res.send({ message: errMsg })
            return
        }
        const bookings = await this.service.getAllSalonBookings(salonId)
        if (!bookings) {
            const errMsg = 'No Bookings Found'
            logger.error(errMsg)
            res.status(400)
            res.send({ message: errMsg })
            return

        }

        res.send(bookings)


    })
    getAllDesignerBookings = controllerErrorHandler(async (req: Request, res: Response) => {
        const designerId = req.params.id
        if (!designerId) {
            const errMsg = 'Designer Id not found'
            logger.error(errMsg)
            res.status(400)
            res.send({ message: errMsg })
            return
        }
        const bookings = this.service.getAllDesignerBookings(designerId)


        res.status(200).send(bookings)

    })
    bookingStatus = async (req: Request, res: Response) => {
        const status = ['Start', 'Done', 'Requested', 'Confirmed', 'Vendor Cancelled', 'Customer Cancelled', 'Completed', 'Vendor Cancelled After Confirmed', 'Customer Cancelled After Confirmed', "Rescheduled Canceled", "Rescheduled"]
        res.send(status)
    }
    rescheduleSlots = controllerErrorHandler(async (req: Request, res: Response) => {
        const id = mongoose.Types.ObjectId(req.params.id) // salon id
        const date = moment() || moment(req.query.date.toString())

        const slots = await this.service.rescheduleSlots(id, date)

        res.send(slots)
        if (!slots) {
            const errMsg = 'No slots Found'
            logger.error(errMsg)
            res.status(400)
            res.send({ message: errMsg })
            return

        }

    })
    getEmployeebookings = controllerErrorHandler(async (req: Request, res: Response) => {
        const q = req.query
        //@ts-ignore
        const empId = req.empId
        const bookings = await this.service.getEmployeebookings(q, empId)

        if (bookings == null) {
            const errMsg = 'No Bookings Found!'
            logger.error(errMsg)
            res.status(400)
            res.send({ message: errMsg })
            return

        }
        res.send(bookings)
    })

}
