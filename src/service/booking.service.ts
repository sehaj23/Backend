import BaseService from "./base.service";
import { Request, Response } from "express";
import { BookingI, BookingServiceI, BookingAddressI, BookingSI, BookinStatus, BookingPaymentType } from "../interfaces/booking.interface";
import logger from "../utils/logger";
import mongoose from "../database";

import { ServiceSI } from "../interfaces/service.interface";
import Offer from "../models/offer.model";
import { SocketRoomType, getVendorRoom } from "./socketio";
import { io } from '../app';
import sendNotificationToDevice from "../utils/send-notification";
import moment = require("moment");
import { String } from "aws-sdk/clients/acm";
import { DateTime } from "aws-sdk/clients/devicefarm";
import ErrorResponse from "../utils/error-response";
import CartService from "./cart.service";
import MongoCounterService from "./mongo-counter.service";
import SalonSI from "../interfaces/salon.interface";

export default class BookingService extends BaseService {
    salonModel: mongoose.Model<any, any>

    cartService: CartService
    mongoCounterService: MongoCounterService
    constructor(bookingmodel: mongoose.Model<any, any>, salonModel: mongoose.Model<any, any>, cartService: CartService, mongoCounterService: MongoCounterService) {
        super(bookingmodel);
        this.salonModel = salonModel
        this.cartService = cartService
        this.mongoCounterService = mongoCounterService
    }

    bookAppointment = async (userId: string, payment_method: BookingPaymentType, location: any, date_time: string, salon_id: string, options: any[], address: BookingAddressI) => {
        try {
            const justDate = date_time.substring(0, 10)
            const justTime = date_time.substring(27, 35)
            logger.info(`justDate ${justDate}`)
            logger.info(`justTime ${justTime}`)
            let convertedDateTime = moment(`${justDate} ${justTime}`).toDate()
            console.log("********")
            console.log(convertedDateTime)

            let nextDateTime: moment.Moment
            const services: BookingServiceI[] = options.map((o) => {
                const totalPrice = o.quantity * o.price
                const zattire_commission = totalPrice * 0.25
                const vendor_commission = totalPrice - zattire_commission

                const totalTime = o.quantity * o.duration
                let service_time: Date
                if (nextDateTime === null || !nextDateTime) {
                    service_time = convertedDateTime
                    nextDateTime =  moment(convertedDateTime).add(totalTime, 'minutes')
                } else {
                    service_time = nextDateTime.toDate()
                    nextDateTime = nextDateTime.add(totalTime, 'minutes')
                }

                const bookingService: BookingServiceI = {
                    option_id: o.option_id,
                    service_name: o.name,
                    service_real_price: o.price,
                    quantity: o.quantity,
                    duration: o.duration,
                    service_total_price: totalPrice,
                    zattire_commission,
                    vendor_commission,
                    service_time
                }
                return bookingService
            })
            const booking_numeric_id = await this.mongoCounterService.incrementByName("booking_id")
            const status: BookinStatus = (payment_method === 'COD') ? 'Online Payment Requested' : 'Requested'
            const booking: BookingI = {
                user_id: userId,
                salon_id: salon_id,
                payment_type: payment_method,
                location: location,
                services,
                address,
                booking_numeric_id,
                status
            }
            const b = await this.model.create(booking)
            // delete the cart of the user
            await this.cartService.bookCartByUserId(userId)
            return b
        } catch (e) {
            throw e
        }
    }

    // post = async (req: Request, res: Response) => {
    //   try {
    //     const e: BookingI = req.body;

    //     if (!e.salon_id && !e.makeup_artist_id && !e.designer_id) {
    //       const errMsg = `Atleast one provider is is reqired out of 3`;
    //       logger.error(errMsg);
    //       res.status(400);
    //       res.send({ message: errMsg });
    //       return;
    //     }

    //     // if(e.salon_id){
    //     //     e.salon_id = mongoose.Types.ObjectId(e.salon_id.toString())
    //     // }
    //     // if(e.makeup_artist_id){
    //     //     e.makeup_artist_id = mongoose.Types.ObjectId(e.makeup_artist_id.toString())
    //     // }
    //     // if(e.designer_id){
    //     //     e.designer_id = mongoose.Types.ObjectId(e.designer_id.toString())
    //     // }
    //     if (!e.designer_id) {
    //       const { services } = e;
    //       if (!services) {
    //         const errMsg = `Services not defined`;
    //         logger.error(errMsg);
    //         res.status(400);
    //         res.send({ message: errMsg });
    //         return;
    //       }

    //       if (services.length === 0) {
    //         const errMsg = `Atleast one services is required. Length is 0`;
    //         logger.error(errMsg);
    //         res.status(400);
    //         res.send({ message: errMsg });
    //         return;
    //       }

    //       const serviceIds = [];
    //       for (let s of services) {
    //         if (s.service_id) {
    //           if (!s.service_time) {
    //             const errMsg = `Service time not found for id: ${s.service_id}`;
    //             logger.error(errMsg);
    //             res.status(400);
    //             res.send({ message: errMsg });
    //             return;
    //           }
    //           serviceIds.push(mongoose.Types.ObjectId(s.service_id));
    //         } else {
    //           const errMsg = `Service Id not found: 22`;
    //           logger.error(errMsg);
    //           res.status(400);
    //           res.send({ message: errMsg });
    //           return;
    //         }
    //       }

    //       if (serviceIds.length === 0) {
    //         const errMsg = `Service Ids not found`;
    //         logger.error(errMsg);
    //         res.status(400);
    //         res.send({ message: errMsg });
    //         return;
    //       }

    //       const serviceInfoReq = Service.find({ _id: { $in: serviceIds } });
    //       const offerInfoReq = Offer.find({ service_id: { $in: serviceIds } });
    //       const [serviceInfo, offerInfo] = await Promise.all([
    //         serviceInfoReq,
    //         offerInfoReq,
    //       ]);

    //       if (serviceInfo.length === 0) {
    //         const errMsg = `serviceInfo not found`;
    //         logger.error(errMsg);
    //         res.status(400);
    //         res.send({ message: errMsg });
    //         return;
    //       }

    //       for (let offer of offerInfo) {
    //         for (let service of serviceInfo) {
    //           if (offer._id === service._id) {
    //             // TODO:
    //           }
    //         }
    //       }
    //     }
    //     const booking = await Booking.create(e);
    //     const vendorId: string = (booking.salon_id || booking.makeup_artist_id || booking.designer_id) as string

    //     console.log(io.sockets.adapter.rooms)
    //     if(io.sockets.adapter.rooms[`${SocketRoomType.Admin}`]){
    //       io.sockets.in(`${SocketRoomType.Admin}`).emit('new-booking', {bookingId: booking._id})
    //     }
    //     if(io.sockets.adapter.rooms[`${getVendorRoom(vendorId)}`]){
    //       io.sockets.in(`${getVendorRoom(vendorId)}`).emit('new-booking', {bookingId: booking._id})
    //     }

    //     // TODO: Send notification here
    //     // sendNotificationToDevice()

    //     res.send(booking);
    //   } catch (e) {
    //     logger.error(`Post ${e.message}`);
    //     res.status(403);
    //     res.send({ message: `${e.message}` });
    //   }
    // };

    /**
     * 
     * @description This is the service to get the employees fof the salon on given date 
     */
    getSalonEmployees = async (salonId: string, dateTime: DateTime) => {
        const dateTimeD = new Date(dateTime);
        const busyEmployeesIds = [];
        // @ts-ignore
        //  const bookingsDbReq =  Booking.findOne({ services: { service_time: dateTimeD }, salon_id: salonId });
        const salonDbReq = this.salonModel.findById(salonId).select("employees").populate("employees").exec();
        const [salon] = await Promise.all([salonDbReq])
        //   if (bookings !== null) busyEmployeesIds.concat(bookings.services.map(s => s.employee_id))
        for (const bemp of busyEmployeesIds) {
            //@ts-ignore
            const i = salon.employees.findIndex((e) => e._id === bemp);
            if (i !== -1) salon.employees.splice(i, 1);
        }
        return salon
    };

    getSalonBookings = async (salonId: string) => {
        const bookings = await this.model.find({ salon_id: salonId, status: { $ne: "Requested" } }).populate("user_id").exec()
        return bookings
    }

    getmakeupArtistBookings = async (makeupArtistId: string) => {
        const bookings = await this.model.find({ smakeup_artist_id: makeupArtistId, status: { $ne: "Requested" } }).populate("user_id").exec()
        return bookings

    }
    getDesignerBookings = async (designerId: string) => {
        const bookings = await this.model.find({ designer_id: designerId, status: { $ne: "Requested" } }).populate("user_id").exec()
        return bookings

    }
    getPendingSalonBookings = async (salonId: string) => {
        const bookings = await this.model.find({ salon_id: salonId, status: "Requested" }).populate("user_id").exec()
        return bookings

    }
    getPendingmakeupArtistBookings = async (makeupArtistId: string) => {

        const bookings = await this.model.find({ smakeup_artist_id: makeupArtistId, status: "Requested" }).populate("makeup_artists").populate("designers").populate("salons").populate("user_id").exec()
        return bookings



    }
    getPendingDesignerBookings = async (designerId: string) => {



        const bookings = await this.model.find({ designer_id: designerId, status: "Requested" }).populate("user_id").exec()
        return bookings

    }


    updateStatusBookings = async (bookingId: string, status: BookinStatus) => {
        const booking = await this.model.findOne({ _id: mongoose.Types.ObjectId(bookingId)}) as BookingSI
        if(booking === null) throw new Error(`No booking find with this id: ${bookingId}`)
        booking.status = status as BookinStatus
        await booking.save()
        return booking
    }

    assigneEmployeeBookings = async (bookingId: String, serviceName: String, employeeId: String) => {
        const booking = await this.model.update({ _id: bookingId, service: { service_name: serviceName } }, { employee_id: employeeId }, { new: true })
        return booking

    }

    confirmRescheduleSlot = async (bookingId:string,date_time:Date,user_id:string)=>{
       
        return this.model.findOneAndUpdate({_id:bookingId,user_id:user_id},{"services.$.rescheduled_service_time":date_time,status:"Rescheduled"},{new:true})
    }

    getByUserId = async (userId: string) => {
        return this.model.find({ "user_id": userId }).populate("salon_id").populate("user_id").populate("services.employee_id",'name')
    }

    getbookings = async (q) => {

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
        dateFilter["start_date"] = moment().subtract(28, "days").format("YYYY-MM-DD")
        dateFilter["end_date"] = moment().add(1, "days").format("YYYY-MM-DD")
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
                case "start_date":
                    dateFilter["start_date"] = moment(q[k]).format("YYYY-MM-DD").concat("T00:00:00.000Z")
                    break
                case "end_date":
                    if(moment(q[k]).isValid()){
                        dateFilter["end_date"] = moment(q[k]).format("YYYY-MM-DD").concat("T23:59:59.000Z")
                    }
                    break
                case "location":
                    filters["location"] = q[k]
                    break
                case "page_number":
                case "page_length":

                    break
                default:
                    filters[k] = q[k]
            }
            filters["services.service_time"] = {
                "$gte": dateFilter["start_date"],
                "$lt": dateFilter["end_date"]
            }
            //  filters["createdAt"] = {
            //      "$gte": dateFilter["start_date"],
            //      "$lt": dateFilter["end_date"]
            // // }


        }
        console.log(filters);

        const bookingDetailsReq = this.model.find(filters).skip(skipCount).limit(pageLength).sort('-createdAt').populate({ path: "user_id", populate: { path: 'profile_pic' } }).populate("services.employee_id").exec()
        const bookingPagesReq = this.model.count(filters)
        const bookingStatsReq = this.model.find(filters).skip(skipCount).limit(pageLength).sort('-createdAt')


        const [bookingDetails, bookingStats, bookingPages] = await Promise.all([bookingDetailsReq, bookingStatsReq, bookingPagesReq])
        return ({ bookingDetails, bookingStats, bookingPages })



    }
    bookingByID = async (id: string) => {
        const booking = await this.model.findById(id).populate({ path: "user_id", populate: { path: 'profile_pic' } }).populate("services.employee_id").exec()
        return booking


    }

    reschedulebooking = async (id: string, date_time: Array<Date>,current_time:Date) => {
       
        //@ts-ignore
        const booking = await this.model.findByIdAndUpdate(id, {rescheduled_available_slots: date_time, status: "Rescheduled and Pending",rescheduled_request_datetime:current_time }, { new: true })
        console.log(booking)
        return booking


    }
    getAllSalonBookings = async (salonId: string) => {
        const bookings = await this.model.find({ salon_id: salonId }).populate("user_id").exec()
        return bookings

    }
    getAllMuaBookings = async (makeupArtistId: string) => {
        const bookings = await this.model.find({ makeup_artist_id: makeupArtistId }).populate("user_id").exec()
        return bookings
    }
    getAllDesignerBookings = async (designerId: string) => {

        const bookings = await this.model.find({ designer_id: designerId }).populate("user_id").exec()
        return bookings

    }



    rescheduleSlots = async (id, date) => {
        const salon = await this.salonModel.findById(id)

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
        return slots


    }

    /**
     * Get the bookings of all employees on a specific date and time
     */
    getEmployeesBookingsByIdsTime = async (ids, dateTime) => {
        dateTime = moment(dateTime)
        if (!(dateTime as moment.Moment).isValid()) throw new ErrorResponse(`Date time not valid: ${dateTime}`)
        return this.model.find({ "services.employee_id": ids, "services.service_time": dateTime })
    }

    getEmployeebookings = async (q, empId: string) => {

        const pageNumber: number = parseInt(q.page_number || 1)
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


            // filters["date_time"] = {
            //     "$gte": dateFilter["start_date"],
            //     "$lt": dateFilter["end_date"]
            // }
        }
        filters["services.service_time"] = {
            "$gte": dateFilter["start_date"],
            "$lt": dateFilter["end_date"]
        }

        filters["services.employee_id"] = {
            "$in": empId
        }
        console.log(filters);


        const bookingDetailsReq = this.model.find(filters).skip(skipCount).limit(pageLength).sort('-createdAt').populate({ path: "user_id", populate: { path: 'profile_pic' } }).populate("services.employee_id").exec()
        const bookingPagesReq = this.model.count(filters)
        const bookingStatsReq = this.model.find(filters).skip(skipCount).limit(pageLength).sort('-createdAt')


        const [bookingDetails, bookingStats, bookingPages] = await Promise.all([bookingDetailsReq, bookingStatsReq, bookingPagesReq])
        return ({ bookingDetails, bookingStats, bookingPages })




    }

    cancelBooking = async (userId: string, bookingId: string, reasonText: string) => {
        const booking = await this.model.findOne({user_id: userId, _id: mongoose.Types.ObjectId(bookingId)}) as BookingSI
        if(booking === null) throw new Error(`No booking found with this booking id ${bookingId} for the current user`)
        booking.status = 'Customer Cancelled'
        if(reasonText && reasonText !== ""){
            booking.cancel_reason = reasonText
        }
        await booking.save()
        return booking
    }

    getFullBookingById = async (bookingId: string): Promise<BookingI> => {
        const booking = await this.model.findOne({_id: mongoose.Types.ObjectId(bookingId)}).select("-password").populate("profile_pic").populate({path:"employees",populate: { path: 'photo' }}).populate("user_id").populate("salon_id").populate("designer_id").populate("makeup_artist_id").populate("events") as BookingSI
        const json: BookingI = booking.toJSON()
        const salons: SalonSI[] = await this.salonModel.find({ "services.options._id": json.services.map((s: BookingServiceI) => s.option_id) }).lean()
        console.log(`Salons ${salons.length}`)
        // for(let bookingService of json.services){
        //     for(let salon of salons){
        //         for(let salonService of salon.services){
        //             for(let salonOption of salonService.options){
        //                 if(salonOption._id.toString() === bookingService.option_id.toString()){
        //                     //@ts-ignore
        //                     salonOption.service_name = salonService.name
        //                     //@ts-ignore
        //                     bookingService.option_id = salonOption
        //                 }
        //             }
        //         }
        //     }
        // }
        return json
    }


}
