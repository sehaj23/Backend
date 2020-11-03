import { Request, Response } from "express";
import mongoose from "../database";
import { BookingServiceI, BookingSI } from "../interfaces/booking.interface";
import EmployeeSI from "../interfaces/employee.interface";
import EmployeeAbsenteeismSI from "../interfaces/employeeAbsenteeism.interface";
import { FeedbackI } from "../interfaces/feedback.interface";
import SalonSI from "../interfaces/salon.interface";
import controllerErrorHandler from "../middleware/controller-error-handler.middleware";
import BookingService from "../service/booking.service";
import CartService from "../service/cart.service";
import EmployeeAbsenteesmService from "../service/employee-absentism.service";
import FeedbackService from "../service/feedback.service";
import RazorPayService from "../service/razorpay.service";
import SalonService from "../service/salon.service";
import ErrorResponse from "../utils/error-response";
import logger from "../utils/logger";
import sendNotificationToDevice from "../utils/send-notification";
import BaseController from "./base.controller";
import moment = require("moment");
import Notify from "../service/notify.service";
import UserService from "../service/user.service";
import EmployeeService from "../service/employee.service";


export default class BookingController extends BaseController {

    ZATTIRE_COMMISSION_PECENT = 20

    service: BookingService
    salonService: SalonService
    employeeAbsentismService: EmployeeAbsenteesmService
    cartService: CartService
    userService:UserService
    feedbackService:FeedbackService
    employeeService:EmployeeService
    constructor(service: BookingService, salonService: SalonService, employeeAbsentismService: EmployeeAbsenteesmService, cartService: CartService,feedbackService:FeedbackService,userService:UserService,employeeService:EmployeeService) {
        super(service)
        this.service = service
        this.salonService = salonService
        this.employeeAbsentismService = employeeAbsentismService
        this.cartService = cartService
        this.feedbackService=feedbackService
        this.userService=userService
        this.employeeService=employeeService
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
        const totalAmount = booking?.services?.map((s: BookingServiceI) => s.service_total_price).reduce((preValue: number, currentValue: number) => preValue + currentValue)
        const totalAmountWithTax = Math.round( (totalAmount +  (totalAmount * 0.18) ) * 100) / 100
        logger.info(`totalAmount ${totalAmountWithTax}`)
        const order = await rp.createOrderId(booking._id.toString(), totalAmountWithTax)
        const order_id = order['id']
        logger.info(`order_id ${order_id}`)
        console.log(order)
        res.send({order_id})
    })

    /**
     * @description book the the appointment with the salon
     */
    bookAppointment = controllerErrorHandler(async (req: Request, res: Response) => {
        //@ts-ignore
        const userId = req.userId
        console.log(req.body)
        console.log("userId", userId)
        const { payment_method, location, date_time, salon_id, options, address } = req.body
        let employeeIds: string[]
        let nextDateTime: moment.Moment
        for(let o of options){
            const totalTime = o.quantity * o.duration
            const convertedDateTime = moment(date_time)

            let service_time: moment.Moment
            if (nextDateTime === null || !nextDateTime) {
                service_time = convertedDateTime
                nextDateTime = convertedDateTime.add(totalTime, 'minutes')
            } else {
                service_time = nextDateTime
                nextDateTime = nextDateTime.add(totalTime, 'minutes')
            }
            if(!o.employee_id || o.employee_id === null){
                console.log(`Employee id is null for.. geting`)
                if(!employeeIds || employeeIds?.length === 0){
                    const salon = await this.salonService.getId(salon_id) as SalonSI
                    if(salon === null) throw new ErrorResponse(`No salon found with salon id ${salon_id}`)
                    employeeIds = (salon?.employees as EmployeeSI[] ?? []).map((e: EmployeeSI) => e._id.toString())
                }
                for(let i = 0; i < employeeIds.length; i++){
                    const empId = employeeIds[i]
                    const mongooseDateTime = service_time.toISOString()
                    const empBookings = await this.service.get({"services.employee_id": mongoose.Types.ObjectId(empId), "services.service_time": mongooseDateTime})
                    if(empBookings.length > 0) continue
                    console.log("empBookings")
                    console.log(empBookings)
                    
                    const empAbs = await this.employeeAbsentismService.get({"employee_id": mongoose.Types.ObjectId(empId), absenteeism_date: service_time.format(moment.HTML5_FMT.DATE)}) as EmployeeAbsenteeismSI[]
                    if(empAbs.length > 0){
                        console.log("empAbs")
                        console.log(empAbs)
                        for(let j = 0; j < empAbs.length;j++){
                            const empAb = empAbs[j]
                            let absent = false
                            for(let empAbTime of empAb.absenteeism_times){
                                console.log("empAbTime", empAbTime)
                                console.log("dateTime.format('h:mm A')", service_time.format('h:mm A'))
                                if(empAbTime === service_time.format('h:mm A')){
                                    absent = true
                                    break
                                }
                            }
                            if(absent === false){
                                o.employee_id = empId
                                break
                            }
                        }
                    }else{
                        o.employee_id = empId
                    }
                    if(o.employee_id){
                        break
                    }
                }
            }
            if(!o.employee_id || o.employee_id === null){
                throw new ErrorResponse(`No employee found at this time for the service`)
            }
        }
        const booking = await this.service.bookAppointment(userId, payment_method, location, date_time, salon_id, options, address)
    //     const user = await this.userService.getId(userId)
    //     const salon = await this.salonService.getId(salon_id)
    //     const employee = await this.employeeService.getByIds(options.employee_id)
    //    const notify = Notify.bookingConfirm(user.phone,user.email,user.fcm_token,salon.contact_number,salon.email,salon.name,employee.phone,employee.fcm_token,booking.id,booking.booking_numeric_id,booking.services[0].service_time)
    //    console.log(notify)
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
        logger.info(status)

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
        const userData =  this.userService.getId(booking.user_id.toString())
        const salonData =  this.salonService.getId(booking.salon_id.toString())
        const employeeData =   this.employeeService.getId(booking.services[0].employee_id.toString())
        const [employee,salon,user]= await  Promise.all([userData,salonData,employeeData])

        console.log(employee.fcm_token)
        console.log(salon.email)
        console.log(user.phone)
        
       
        if (!booking) {
            const errMsg = 'No Bookings Found'
            logger.error(errMsg)
            res.status(400)
            res.send({ message: errMsg })
            return

        }
        const bookingTime = moment(booking.services[0].service_time).format('MMMM Do YYYY, h:mm:ss a'); 
        if(status==="Confirmed"){
            const notify = Notify.bookingConfirm(user.phone,user.email,user.fcm_token,salon.contact_number,salon.email,salon.name,employee.phone,employee.fcm_token,booking.id,booking.booking_numeric_id.toString(),bookingTime)
            console.log(notify)
            }
        var message = {
            notification: {
              title: '$FooCorp up 1.43% on the day',
              body: '$FooCorp gained 11.80 points to close at 835.67, up 1.43% on the day.'
            },
          };
        sendNotificationToDevice("dIHYFzDfSkRqmFz0fXgfQP:APA91bHY7Heuln_-h4Vx3bCgcXVjkqx5qejHqyL7Sc0cA6hI1hPTrdrZXSdLiIEYGhtzIeo41zKdItd1w65B1fnxsd1DlbFeRTvRepswOZz-hWB-c8wBL-i22Q24T-9OJ0ANkxQYzZIX",message)
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
        const currentTime = moment().toDate()
      
    

       // const rescheduleDate = moment(date_time).toDate()
        
        datetime.map(function (o){
           return moment(o).toDate()
        })
        
       
        if (!id) {
            const errMsg = "Error Booking not found"
            logger.error(errMsg)
            res.status(400)
            res.send({ message: errMsg })
            return
        }
        const booking = await this.service.reschedulebooking(id, datetime,currentTime)
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

    bookingFeedback = controllerErrorHandler(async (req: Request, res: Response) => {
        //TODO: check if the user had that booking
        const bookingId = req.params.id
        const data:FeedbackI =req.body
        data.booking_id=bookingId
        const feedback = await this.feedbackService.post(data)
        res.send(feedback)
    })

    getBookingsAdmin =  controllerErrorHandler(async (req: Request, res: Response) => {
        const q = req.query
        const booking = await this.service.getbookingsAdmin(q)
        res.send(booking)  
    })

    bookAgain = controllerErrorHandler(async (req: Request, res: Response) => {
        const {booking_id} = req.body
        const cart = await this.service.bookAgain(booking_id)
        res.send(cart)  
    })
}
