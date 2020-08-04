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
import EmployeeAbsentismService from "../service/employee-absentism.service";


export default class BookingController extends BaseController {

    service: BookingService
    salonService: SalonService
    employeeAbsentismService: EmployeeAbsentismService
    constructor(service: BookingService, salonService: SalonService, employeeAbsentismService: EmployeeAbsentismService) {
        super(service)
        this.service = service
        this.salonService = salonService
        this.employeeAbsentismService = employeeAbsentismService
    }

    /**
     * @description book the the appointment with the salon
     */
    bookAppointment = controllerErrorHandler(async (req: Request, res: Response) => {
        // get the user id
        //@ts-ignore
        const userId = req.id
        // get all the services by OPTION ids
        const gotOptionIds = req.body.option_ids as any[]
        // get the details of the services
        const services = await this.salonService.getServicesByOptionIds(gotOptionIds) as any[]
        if(services.length === 0){
            throw new ErrorResponse("No services chosen")
        }
        //TODO: add the tax logic
        // get the date and time of the service
        const gotServiceDate = req.body.date
        const gotServiceTime = req.body.time
        // get location of the service ["home", "store"]
        const gotLocation = req.body.location
        // get the employee ids if chosen
        const gotEmployeeIds = req.body.employee_ids as any[]
        if(gotEmployeeIds.length > 0){
            // then check 
                // 1. check if employee ids selected matches the number of options
                    // a. if service loaction is home then there should be only one employee id
                    if(gotEmployeeIds.length > 1 && gotLocation === "home") throw new ErrorResponse("Cannot select more than 1 employee when booking for home")
                    // b. if at salon, then handle later

                // 1. check if the employee ids belong to salon or not
                const salonEmployeeIds = await this.salonService.getSalonEmployeesByIds(gotEmployeeIds) as any[]
                if(salonEmployeeIds.length !== gotEmployeeIds.length) throw new ErrorResponse("Employee does not match with salon")
                // 2. the avalabilty of the employee if not available
                    // a. if not booked already
                    const servicesByEmployees =  await this.service.getEmployeesBookingsByIdsTime(gotEmployeeIds, `${gotServiceDate} ${gotServiceTime}` ) as any[]
                    if(servicesByEmployees.length !== 0) throw new ErrorResponse("Employees are busy")
                    // b. if absent (only checking date)
                    const absentEmployees = await this.employeeAbsentismService.get({"employee_id": gotEmployeeIds, "absenteeism_date": gotServiceDate}) as any[]
                    if(absentEmployees.length === 0) throw new ErrorResponse("Employees are absent")
                // 1.b Handling if at salon
                if(gotEmployeeIds.length !== gotOptionIds.length){
                    // add employees for the service
                    // 1. get employees who do this service
                }
        }
                
                // else book the appointment
            // else search for employees free at that time. If found
                // then select those employees and book the appointment
                // else send error
                
    })

    getSalonEmployees = controllerErrorHandler(async (req: Request, res: Response) => {

        if (!req.params.salonId) {
            const errMsg = `Salon Id not found`;
            logger.error(errMsg);
            res.status(400);
            res.send({ message: errMsg });
            return;
        }
        if (!req.body.dateTime) {
            const errMsg = `dateTime not found`;
            logger.error(errMsg);
            res.status(400);
            res.send({ message: errMsg });
            return
        }
        const salon = await this.service.getSalonEmployees(req.body.username, req.body.dateTime)
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
        const date = moment() || moment(req.query.date)

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
