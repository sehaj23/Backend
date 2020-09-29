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
import CartService from "../service/cart.service";
import { CartSI } from "../interfaces/cart.interface";
import { ServiceSI } from "../interfaces/service.interface";
import { map } from "bluebird";
import RazorPayService from "../service/razorpay.service";


export default class BookingController extends BaseController {

    ZATTIRE_COMMISSION_PECENT = 20

    service: BookingService
    salonService: SalonService
    employeeAbsentismService: EmployeeAbsenteesmService
    cartService: CartService
    constructor(service: BookingService, salonService: SalonService, employeeAbsentismService: EmployeeAbsenteesmService, cartService: CartService) {
        super(service)
        this.service = service
        this.salonService = salonService
        this.employeeAbsentismService = employeeAbsentismService
        this.cartService = cartService
    }


    getAppointment = controllerErrorHandler(async (req: Request, res: Response) => {
        //@ts-ignore
        const bookings = await this.service.getByUserId(req.userId)
        res.send(bookings)
    })

    getRazorpayOrderId = controllerErrorHandler(async (req: Request, res: Response) => {
        const {id} = req.params
        const booking = await this.service.getId(id) as BookingSI
        if(booking === null) throw new ErrorResponse("No booking found with this id")
        if(booking.razorpay_order_id && booking.razorpay_order_id !== null){
            res.send({order_id: booking.razorpay_order_id})
            return
        }
        const rp = new RazorPayService()
        const order = await rp.createOrderId(booking._id.toString())
        res.send({order_id: order['id']})
    })

    /**
     * @description book the the appointment with the salon
     */
    bookAppointment = controllerErrorHandler(async (req: Request, res: Response) => {

        //@ts-ignore
        const userId = req.userId

        const { payment_method, location, date_time, salon_id, options, address } = req.body
        const booking = await this.service.bookAppointment(userId, payment_method, location, date_time, salon_id, options, address)
        logger.info("info", booking)
        res.send(booking);
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
        const booking = await this.service.updateStatusBookings(bookingid, status)
        if (!booking) {
            const errMsg = 'No Bookings Found'
            logger.error(errMsg)
            res.status(400)
            res.send({ message: errMsg })
            return

        }
        res.send({message:"Booking status changed",success:"true"})

    })

    confirmRescheduleSlot = controllerErrorHandler(async (req: Request, res: Response) => {
        const bookingId = req.params.id
        const date_time = req.body.rescheduled_service_time
        //@ts-ignore
        const userId = req.userId
        var rescheduleditime =  moment(date_time).toDate()
        const booking = await this.service.confirmRescheduleSlot(bookingId,rescheduleditime,userId)
        if (!booking) {
            const errMsg = 'No Bookings Found'
            logger.error(errMsg)
            res.status(400)
            res.send({ message: errMsg,success:false })
            return

        }
        res.send({message:"Booking Confirmed",success:true})

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
    getbookingbyId = controllerErrorHandler(async (req: Request, res: Response) => {
        const id = req.params.id
        const booking = await this.service.bookingByID(id)
         if (booking === null) {
            const errMsg = "unable to update boooking"
            logger.error(errMsg)
            res.status(400)
            res.send({ message: errMsg })
            return

        }
        res.status(200).send(booking)
        

    })
    reschedulebooking = controllerErrorHandler(async (req: Request, res: Response) => {
        const id = req.params.id
        const datetime = req.body.date_time
      
    

       // const rescheduleDate = moment(date_time).toDate()
        
        console.log("*********")
        datetime.map(function (o){
           return moment(o).toDate()
        })
        console.log(datetime)
        
       
        if (!id) {
            const errMsg = "Error Booking not found"
            logger.error(errMsg)
            res.status(400)
            res.send({ message: errMsg })
            return
        }
        const booking = await this.service.reschedulebooking(id, datetime)
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

       
        if (!slots) {
            const errMsg = 'No slots Found'
            logger.error(errMsg)
            res.status(400)
            res.send({ message: errMsg })
            return
        }
        res.send(slots)
    })
    getEmployeebookings = controllerErrorHandler(async (req: Request, res: Response) => {
        const q = req.query

        //@ts-ignore
        const empId = req.empId
        console.log(empId)
        const bookings = await this.service.getEmployeebookings(q, empId)
        console.log(bookings)
        if (bookings == null) {
            const errMsg = 'No Bookings Found!'
            logger.error(errMsg)
            res.status(400)
            res.send({ message: errMsg })
            return

        }
        res.send(bookings)
    })

    cancelBooking = controllerErrorHandler(async (req: Request, res: Response) => {
        //@ts-ignore
        const userId = req.userId
        const bookingId = req.params.bookingId
        const {reason} = req.body
        const data = await  this.service.cancelBooking(userId, bookingId, reason)
        res.send(data)
    })

    getFullBookingById = controllerErrorHandler(async (req: Request, res: Response) => {
        const bookingId = req.params.id
        const data = await this.service.getFullBookingById(bookingId)
        res.send(data)
    })

}
