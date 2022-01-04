import { String } from "aws-sdk/clients/acm";
import mongoose from "../database";
import { Author, BookingAddressI, BookingI, BookingPaymentI, BookingPaymentMode, BookingPaymentVerifiedStatusEnum, BookingServiceI, BookingSI, BookinStatus } from "../interfaces/booking.interface";
import { CartOption } from "../interfaces/cart.interface";
import EmployeeSI from "../interfaces/employee.interface";
import SalonSI from "../interfaces/salon.interface";
import { WalletTransactionI } from "../interfaces/wallet-transaction.interface";
import { BookingRedis } from "../redis/index.redis";
import ErrorResponse from "../utils/error-response";
import MyStringUtils from "../utils/my-string.utils";
import BaseService from "./base.service";
import CartService from "./cart.service";
import MongoCounterService from "./mongo-counter.service";
import WalletTransactionService from "./wallet-transaction.service";


import moment = require("moment");

export default class BookingService extends BaseService {
    salonModel: mongoose.Model<any, any>
    referral: mongoose.Model<any, any>
    cartService: CartService
    mongoCounterService: MongoCounterService
    walletTransactionService: WalletTransactionService
    constructor(bookingmodel: mongoose.Model<any, any>, salonModel: mongoose.Model<any, any>, cartService: CartService, mongoCounterService: MongoCounterService, referral: mongoose.Model<any, any>, walletTransactionService: WalletTransactionService) {
        super(bookingmodel);
        this.salonModel = salonModel
        this.cartService = cartService
        this.mongoCounterService = mongoCounterService
        this.referral = referral
        this.walletTransactionService = walletTransactionService
    }

    bookAppointment = async (userId: string, payments: BookingPaymentI[], location: any, date_time: string, salon_id: string, options: any[], address: BookingAddressI, promo_code: string, actualStatus: BookinStatus, commision_percentage: number) => {
        try {
            let convertedDateTime: moment.Moment = moment(date_time)//.local()

            let nextDateTime: moment.Moment
            const services: BookingServiceI[] = options.map((o) => {
                let totalPrice = o.quantity * o.price
                let zattire_commission = totalPrice * commision_percentage / 100
                const vendor_commission = totalPrice - zattire_commission
                if (o.discount_given && o.discount_given !== 0) {
                    zattire_commission -= o.discount_given
                    totalPrice -= o.discount_given
                }

                const totalTime = o.quantity * o.duration
                let service_time: Date
                if (nextDateTime === null || !nextDateTime) {
                    service_time = convertedDateTime.toDate()
                    nextDateTime = convertedDateTime.add(totalTime, 'minutes')
                } else {
                    service_time = nextDateTime.toDate()
                    nextDateTime = nextDateTime.add(totalTime, 'minutes')
                }

                const bookingService: BookingServiceI = {
                    category_name: o.category_name,
                    option_name: o.name,
                    option_id: o.option_id,
                    service_name: o.service_name,
                    gender: o.gender,
                    service_real_price: o.price,
                    quantity: o.quantity,
                    duration: o.duration,
                    service_total_price: totalPrice,
                    service_discount: o.discount_given,
                    service_discount_code: promo_code,
                    zattire_commission,
                    vendor_commission,
                    service_time,
                    employee_id: o.employee_id
                }
                return bookingService
            })
            const booking_numeric_id = await this.mongoCounterService.incrementByName("booking_id")

            // const status: BookinStatus = (payment_method === 'COD') ? actualStatus : 'Online Payment Requested'
            let status: BookinStatus
            let usedWalletAmount: number = -1 // used as a flag
            for (const p of payments) {
                if (p.mode === BookingPaymentMode.COD) {
                    status = actualStatus
                    p.verified_status = BookingPaymentVerifiedStatusEnum.SUCCESSFUL
                    break
                } else if (p.mode === BookingPaymentMode.RAZORPAY) {
                    status = 'Online Payment Requested'
                    break
                } else if (p.mode === BookingPaymentMode.WALLET) {
                    usedWalletAmount = p.amount
                }
            }
            const booking: BookingI = {
                user_id: userId,
                salon_id: salon_id,
                payments: payments,
                location: location,
                services,
                address,
                booking_numeric_id,
                status
            }
            const b = await this.model.create(booking) as BookingSI
            if (usedWalletAmount > -1) {
                const walletTransactionI: WalletTransactionI = {
                    amount: (usedWalletAmount*-1),
                    user_id: b.user_id.toString(),
                    reference_model: 'bookings',
                    reference_id: b._id.toString(),
                    transaction_type: "Used Credits",
                    transaction_owner: "ALGO",
                    comment: "Used Credits"
                }
                await this.walletTransactionService.post(walletTransactionI)
            }
            // delete the cart of the user
            await this.cartService.bookCartByUserId(userId)
            return b
        } catch (e) {
            console.log(e)
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
    getSalonEmployees = async (salonId: string, dateTime, employee: EmployeeSI[]) => {
        const dateTimeAdd = moment(dateTime).add(15, 'minutes').format("YYYY-MM-DDTHH:mm:ss").concat(".000+00:00")
        const dateTimeSub = moment(dateTime).subtract(15, 'minutes').format("YYYY-MM-DDTHH:mm:ss").concat(".000+00:00")

        let busyEmployeesIds = [];
        let busy = [];
        let book = []


        // @ts-ignore
        const bookingsDbReq = this.model.find({ services: { $elemMatch: { service_time: { $gte: dateTimeSub, $lt: dateTimeAdd } } }, salon_id: salonId, status: { $in: ["Confirmed", "Requested", "Start", "Rescheduled", "Rescheduled and Pending"] } }).sort({ "createdAt": -1 });

        // const salonDbReq = this.salonModel.findById(salonId).select("employees").populate({
        //     path: 'employees',
        //     populate: {
        //         path: 'photo'
        //     }
        // }).exec();
        const [bookings] = await Promise.all([bookingsDbReq])
        if (bookings !== null) {
            for (let i = 0; i < bookings.length; i++) {
                const booking = bookings[i]
                booking.services.map(s => {
                    book.push(s.employee_id)
                })
            }

            busy = busyEmployeesIds.concat(book)
        }

        for (const bemp of busy) {

            //@ts-ignore
            const i = employee.findIndex((e) => {
                return JSON.stringify(e._id) == JSON.stringify(bemp)
            });
            if (i !== -1) employee.splice(i, 1);
        }
        // for (const bem of salon.employees) {

        //     //@ts-ignore
        //     const i = employe.findIndex((e) => {
        //         return JSON.stringify(e._id) != JSON.stringify(bem._id)
        //     });
        //     if (i != -1) salon.employees.splice(i, 1);
        // }



        return employee
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


    updateStatusBookings = async (bookingId: string, status: BookinStatus, author: Author, authorId) => {
        const booking = await this.model.findOne({ _id: mongoose.Types.ObjectId(bookingId) }) as BookingSI
        if (booking === null) throw new Error(`No booking find with this id: ${bookingId}`)
        booking.history.push({ status_changed_to: status, last_status: booking.status, changed_by: author })
        booking.status = status as BookinStatus
        await booking.save()
        return booking
        // const booking = await this.model.findByIdAndUpdate({bookingId},{status:status,$push:{history:{status_changed_to:status,last_status:}}},{new:true})
    }

    assigneEmployeeBookings = async (bookingId: String, serviceName: String, employeeId: String) => {
        const booking = await this.model.update({ _id: bookingId, service: { service_name: serviceName } }, { employee_id: employeeId }, { new: true })
        return booking

    }

    confirmRescheduleSlot = async (bookingId: string, date_time: Date, user_id: string) => {
        const booking = await this.model.findOne({ _id: bookingId, user_id: user_id }) as BookingSI
        if (booking === null) throw new Error("Booking not found with given bookingId and userId")
        const { services } = booking
        let serviceTime: moment.Moment
        for (let s of services) {
            if (!serviceTime) {
                serviceTime = moment(date_time)
            } else {
                serviceTime = serviceTime.add(s.duration, 'minutes')
            }
            s.service_time = serviceTime.toDate()
        }
        booking.status = 'Rescheduled'
        await booking.save()
        return booking
    }

    getByUserId = async (userId: string) => {
        const bookingRedis = await BookingRedis.get(userId, { type: "getByUserId" })
        if (bookingRedis === null) {
            const booking = await this.model.find({ "user_id": userId }).populate("salon_id").populate("user_id").populate("services.employee_id", 'name').lean()
            BookingRedis.set(userId, JSON.stringify(booking), { type: "getByUserId" })
            return booking
        }
        return JSON.parse(bookingRedis)
    }



    getBookingByUserId = async (userId: string, q: any) => {
        const pageNumber: number = parseInt(q.page_number || 1)
        let pageLength: number = parseInt(q.page_length || 25)
        pageLength = (pageLength > 100) ? 100 : pageLength
        const skipCount = (pageNumber - 1) * pageLength
        const bookingReq = this.model.find({ "user_id": userId }).skip(skipCount).limit(pageLength).sort({ 'createdAt': -1 }).lean().populate("salon_id", "name")
        const bookingCountReq = this.model.count({ "user_id": userId })
        const [booking, bookingCount] = await Promise.all([bookingReq, bookingCountReq])
        return { booking, bookingCount }
    }

    getbookings = async (q) => {
        const pageNumber: number = parseInt(q.page_number || 1)
        let pageLength: number = parseInt(q.page_length || 25)
        //TODO:remove page length for cron 
        pageLength = (pageLength > 100) ? 100 : pageLength
        const skipCount = (pageNumber - 1) * pageLength
        const keys = Object.keys(q)
        const filters = {}
        const dateFilter = {}
        dateFilter["start_date"] = moment().format("YYYY-MM-DD")
        dateFilter["end_date"] = moment().add(28, "days").format("YYYY-MM-DD")
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
                    if (moment(q[k]).isValid()) {
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
        const bookingDetailsReq = this.model.find(filters).skip(skipCount).limit(pageLength).sort({ 'createdAt': -1 }).populate({ path: "user_id", fcm_token: 1, populate: { path: 'profile_pic' } }).populate("services.employee_id").exec()
        const bookingPagesReq = this.model.count(filters)
        // const bookingStatsReq = this.model.find(filters).skip(skipCount).limit(pageLength).sort('-createdAt')


        const [bookingDetails, bookingPages] = await Promise.all([bookingDetailsReq, bookingPagesReq])
        return ({ bookingDetails, bookingPages })



    }
    bookingByID = async (id: string) => {
        const booking = await this.model.findById(id).populate({ path: "user_id", populate: { path: 'profile_pic' } }).populate("services.employee_id").populate("salon_id", "name").exec()
        return booking
    }

    reschedulebooking = async (id: string, date_time: Array<Date>, current_time: Date) => {
        //@ts-ignore
        const booking = await this.model.findByIdAndUpdate(id, { rescheduled_available_slots: date_time, status: "Rescheduled and Pending", rescheduled_request_datetime: current_time }, { new: true })
        return booking
    }
    getAllSalonBookings = async (salonId: string, q: any) => {
        const pageNumber: number = parseInt(q.page_number || 1)
        let pageLength: number = parseInt(q.page_length || 25)
        pageLength = (pageLength > 100) ? 100 : pageLength
        const skipCount = (pageNumber - 1) * pageLength
        const keys = Object.keys(q)
        const filters = {
            salon_id: salonId
        }

        const dateFilter = {}
        dateFilter["start_date"] = moment().subtract(28, "days").format("YYYY-MM-DD")
        dateFilter["end_date"] = moment().add(28, "days").format("YYYY-MM-DD")
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
                    if (moment(q[k]).isValid()) {
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




        }
        filters["services.service_time"] = {
            "$gte": dateFilter["start_date"],
            "$lt": dateFilter["end_date"]
        }
        const bookingsReq = this.model.find(filters).skip(skipCount).limit(pageLength).populate("user_id").populate("services.employee_id").sort({ "createdAt": -1 }).exec()
        const bookingPagesReq = this.model.countDocuments(filters)
        const [bookingDetails, bookingPages] = await Promise.all([bookingsReq, bookingPagesReq])
        return ({ bookingDetails, bookingPages })


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
        const end_hours = salon.end_working_hours
        var end_time = end_hours.map(function (val) {
            return moment(val).format('YYYY-MM-DD hh:mm a');;
        })
        const slots = []
        var time1 = start_time[date.day()]
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
        if (!(dateTime as moment.Moment).isValid()) throw new ErrorResponse({ message: `Date time not valid: ${dateTime}` })
        return this.model.find({ "services.employee_id": ids, "services.service_time": dateTime })
    }

    getEmployeebookings = async (q, empId: string) => {

        const pageNumber: number = parseInt(q.page_number || 1)
        let pageLength: number = parseInt(q.page_length || 25)
        pageLength = (pageLength > 100) ? 100 : pageLength
        const skipCount = (pageNumber - 1) * pageLength

        const keys = Object.keys(q)
        const filters = {}
        const dateFilter = {}


        dateFilter["start_date"] = moment().format("YYYY-MM-DD")
        dateFilter["end_date"] = moment().add(28, "days").format("YYYY-MM-DD")


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


        const bookingDetailsReq = this.model.find(filters).skip(skipCount).limit(pageLength).sort('-createdAt').populate({ path: "user_id", populate: { path: 'profile_pic' } }).populate("services.employee_id").exec()
        const bookingPagesReq = this.model.count(filters)
        const bookingStatsReq = this.model.find(filters).skip(skipCount).limit(pageLength).sort('-createdAt')


        const [bookingDetails, bookingStats, bookingPages] = await Promise.all([bookingDetailsReq, bookingStatsReq, bookingPagesReq])
        return ({ bookingDetails, bookingStats, bookingPages })




    }

    cancelBooking = async (userId: string, bookingId: string, reasonText: string) => {
        const booking = await this.model.findOne({ user_id: userId, _id: mongoose.Types.ObjectId(bookingId) }) as BookingSI
        if (booking === null) throw new Error(`No booking found with this booking id ${bookingId} for the current user`)
        booking.status = 'Customer Cancelled'
        if (reasonText && reasonText !== "") {
            booking.cancel_reason = reasonText
        }
        await booking.save()
        return booking
    }

    getFullBookingById = async (bookingId: string): Promise<BookingI> => {
        const booking = await this.model.findOne({ _id: mongoose.Types.ObjectId(bookingId) }).select("-password").populate("profile_pic").populate({ path: "employees", populate: { path: 'photo' } }).populate("user_id").populate("salon_id").populate("designer_id").populate("makeup_artist_id").populate("events").populate("services.employee_id") as BookingSI
        const json: BookingI = booking.toJSON()
        const salons: SalonSI[] = await this.salonModel.find({ "services.options._id": json.services.map((s: BookingServiceI) => s.option_id) }).lean()
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

    getbookingsAdmin = async (q) => {



        const pageNumber: number = parseInt(q.page_number || 1)
        let pageLength: number = parseInt(q.page_length || 25)
        pageLength = (pageLength > 100) ? 100 : pageLength
        const skipCount = (pageNumber - 1) * pageLength

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
                    filters["status"] = { "$in": q[k] }
                    break;
                case "start_date":
                    dateFilter["start_date"] = moment(q[k]).format("YYYY-MM-DD").concat("T00:00:00.000Z")
                    break
                case "end_date":
                    if (moment(q[k]).isValid()) {
                        dateFilter["end_date"] = moment(q[k]).format("YYYY-MM-DD").concat("T23:59:59.000Z")
                    }
                    break
                case "location":
                    filters["location"] = q[k]
                    break
                case "user_id":
                    filters["user_id"] = q[k]
                    break
                case "salon_id":
                    filters["salon_id"] = q[k]
                    break
                case "page_number":
                case "page_length":

                    break
                default:
                    filters[k] = q[k]
            }
            if(q.start_date && q.end_date){
            filters["services.service_time"] = {
                "$gte": dateFilter["start_date"],
                "$lt": dateFilter["end_date"]
            }
            }
            //  filters["createdAt"] = {
            //      "$gte": dateFilter["start_date"],
            //      "$lt": dateFilter["end_date"]
            // // }


        }
  


        const bookingDetailsReq = this.model.find(filters).skip(skipCount).limit(pageLength).sort('-createdAt').populate({ path: "user_id", populate: { path: 'profile_pic' } }).populate("services.employee_id").exec()
        const bookingPagesReq = this.model.count(filters)
        const bookingStatsReq = this.model.find(filters).skip(skipCount).limit(pageLength).sort('-createdAt')


        const [bookingDetails, bookingStats, bookingPages] = await Promise.all([bookingDetailsReq, bookingStatsReq, bookingPagesReq])
        return ({ bookingDetails, bookingStats, bookingPages })



    }

    bookAgain = async (bookingId: string) => {
        try {
            const booking = await this.getId(bookingId) as BookingSI
            if (booking === null) throw Error(`Booking not found with this id`)
            const userId = MyStringUtils.getMongoId(booking.user_id)
            const salonId = MyStringUtils.getMongoId(booking.salon_id)
            if (!userId) throw new Error(`User id not found in the booking`)
            if (!salonId) throw new Error(`Salon id not found in the booking`)

            try {
                this.cartService.deleteCartByUserId(userId)
            } catch (error) { }

            const cartOptions: CartOption[] = []
            for (let service of booking.services) {
                const cartOption: CartOption = {
                    option_id: service.option_id,
                    quantity: service.quantity,
                    service_name: service.service_name,
                    option_name: service.option_name,
                    category_name: service.category_name

                }
                cartOptions.push(cartOption)
            }
            const cart = await this.cartService.createCartWithMultipleOptions(userId, salonId, cartOptions)
            return cart
        } catch (error) {
            throw error
        }
    }

    checkCOD =async (filter:any,limit:number) => {
        const bookings  = await this.model.find(filter).limit(limit).sort({createdAt:-1})
        return bookings
    }


}
