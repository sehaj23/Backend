import { Request, Response } from "express";
import { sqsWalletTransaction, SQSWalletTransactionI } from "../aws";
import mongoose from "../database";
import { BookingPaymentI, BookingPaymentMode, BookingServiceI, BookingSI, BookinStatus, RazorpayPaymentData } from "../interfaces/booking.interface";
import { CartSI } from "../interfaces/cart.interface";
import EmployeeSI from "../interfaces/employee.interface";
import EmployeeAbsenteeismSI from "../interfaces/employeeAbsenteeism.interface";
import { FeedbackI } from "../interfaces/feedback.interface";
import { PromoCodeSI, PromoDiscountResult } from "../interfaces/promo-code.interface";
import { PromoUserSI } from "../interfaces/promo-user.inderface";
import { ReferralSI } from "../interfaces/referral.interface";
import { RefundI, RefundTypeEnum } from "../interfaces/refund.interface";
import SalonSI from "../interfaces/salon.interface";
import UserI from "../interfaces/user.interface";
import controllerErrorHandler from "../middleware/controller-error-handler.middleware";
import BookingService from "../service/booking.service";
import CartService from "../service/cart.service";
import EmployeeAbsenteesmService from "../service/employee-absentism.service";
import EmployeeService from "../service/employee.service";
import FeedbackService from "../service/feedback.service";
import Notify from "../service/notify.service";
import PromoUserService from "../service/promo-user.service";
import RazorPayService from "../service/razorpay.service";
import ReferralService from "../service/referral.service";
import RefundService from "../service/refund.service";
import SalonService from "../service/salon.service";
import UserService from "../service/user.service";
import VendorService from "../service/vendor.service";
import ErrorResponse from "../utils/error-response";
import logger from "../utils/logger";
import BaseController from "./base.controller";
import moment = require("moment");


export default class BookingController extends BaseController {

    ZATTIRE_COMMISSION_PECENT = 20

    service: BookingService
    salonService: SalonService
    employeeAbsentismService: EmployeeAbsenteesmService
    cartService: CartService
    userService: UserService
    feedbackService: FeedbackService
    employeeService: EmployeeService
    vendorService: VendorService
    promoUserService: PromoUserService
    referralService: ReferralService
    refundService: RefundService
    constructor(service: BookingService, salonService: SalonService, employeeAbsentismService: EmployeeAbsenteesmService, cartService: CartService, feedbackService: FeedbackService, userService: UserService, employeeService: EmployeeService, vendorService: VendorService, promoUserService: PromoUserService, referralService: ReferralService, refundService: RefundService) {
        super(service)
        this.service = service
        this.salonService = salonService
        this.employeeAbsentismService = employeeAbsentismService
        this.cartService = cartService
        this.feedbackService = feedbackService
        this.userService = userService
        this.employeeService = employeeService
        this.vendorService = vendorService
        this.promoUserService = promoUserService
        this.referralService = referralService
        this.refundService = refundService
    }


    
    getAppointment = controllerErrorHandler(async (req: Request, res: Response) => {
        //@ts-ignore
        const bookings = await this.service.getByUserId(req.userId)
        res.send(bookings)
    })

    getOnlineCancelledBookings = controllerErrorHandler(async (req: Request, res: Response) => {
        //@ts-ignore
        const userId = req.userId
        const booking = await this.service.getOne({
            user_id: mongoose.Types.ObjectId(userId),
            status: {
                "$in": ["Customer Cancelled", "Vendor Cancelled", "Vendor Cancelled After Confirmed", 'Low Funds Canceled'],
            },
            "payments.mode": {
                "$in": [BookingPaymentMode.WALLET, BookingPaymentMode.RAZORPAY]
            }
        }) as BookingSI
        const bookingJson = booking.toJSON()
        let walletAmount: number = 0
        const walletPayemntIndex = booking.payments.findIndex(p => p.mode === BookingPaymentMode.WALLET)
        if (walletPayemntIndex > -1) walletAmount = booking.payments[walletPayemntIndex].amount
        let bookingTotalPrice = booking.services.map((s: BookingServiceI) => s.service_total_price).reduce((a: number, b: number) => a + b) - walletAmount
        bookingTotalPrice = bookingTotalPrice + (bookingTotalPrice * 0.18)
        bookingTotalPrice = parseFloat(bookingTotalPrice.toFixed(2))
        let refundOptions = [
            {
                name: "Zattire Wallet",
                refund_type: RefundTypeEnum.Zattire_Wallet,
                time: "1-10 seconds",
                booking_amount: bookingTotalPrice,
                amount_refunded: bookingTotalPrice,
            },
            {
                name: "Instant - RazorPay",
                refund_type: RefundTypeEnum.Instant_RazorPay,
                time: "1-24 business hours",
                booking_amount: bookingTotalPrice,
                amount_refunded: bookingTotalPrice - RefundService.ZATTIRE_REFUND_COMMISION
            },
            {
                name: "Normal - RazorPay",
                refund_type: RefundTypeEnum.Normal_RazorPay,
                time: "5-10 business days",
                booking_amount: bookingTotalPrice,
                amount_refunded: bookingTotalPrice
            }
        ]
        const paymentModes = booking.payments.map((m: BookingPaymentI) => m.mode)
        if (paymentModes.length === 1 && paymentModes[0] === BookingPaymentMode.RAZORPAY) {
            refundOptions = [refundOptions[0]]
        }
        bookingJson['refundOptions'] = refundOptions
        res.send(bookingJson)
    })

    checkCod = controllerErrorHandler(async (req: Request, res: Response) => {
        //@ts-ignore
        const id = req.userId
        const codBookingReq =  this.service.get({ user_id: id, "payments.mode": "'COD", status: { $in: ['Customer Cancelled', 'No Show'] } })
        const onlineBookingReq =  this.service.get({ user_id: id, "payments.mode": "'RAZORPAY", status: 'Completed' })
        const [codBooking,onlineBooking] =  await Promise.all([codBookingReq,onlineBookingReq])
        if (codBooking.length > onlineBooking.length) {
            res.status(400).send({ message: "COD not allowed", success: false })
        } else {
            res.status(200).send({ message: "COD allowed", success: true })
        }
    })

    getRazorpayOrderId = controllerErrorHandler(async (req: Request, res: Response) => {
        const { id } = req.params
        const booking = await this.service.getId(id) as BookingSI
        if (booking === null)
            // {throw new ErrorResponse("No booking found with this id")}
            if (booking.razorpay_order_id && booking.razorpay_order_id !== null) {
                res.send({ order_id: booking.razorpay_order_id })
                return
            }
        const rp = new RazorPayService()
        const totalAmount = booking?.services?.map((s: BookingServiceI) => s.service_total_price).reduce((preValue: number, currentValue: number) => preValue + currentValue)
        let totalAmountWithTax = Math.round((totalAmount + (totalAmount * 0.18)) * 100) / 100
        logger.info(`totalAmount ${totalAmountWithTax}`)
        if (booking.payments.length > 1) {
            for (let payment of booking.payments) {
                if (payment.mode === BookingPaymentMode.WALLET) {
                    totalAmountWithTax -= payment.amount
                }
            }
        }
        const order = await rp.createOrderId(booking._id.toString(), totalAmountWithTax)
        const order_id = order['id']
        logger.info(`order_id ${order_id}`)
        console.log(order)
        booking.razorpay_order_id = order_id
        await booking.save()
        res.send({ order_id })
    })

    /**
     * @description book the the appointment with the salon
     */
    bookAppointment = controllerErrorHandler(async (req: Request, res: Response) => {
        //@ts-ignore
        const userId = req.userId
        console.log(req.body)
        console.log("userId", userId)
        const { payment_method, location, date_time, salon_id, options, address, promo_code, cart_id } = req.body
        let employeeIds: string[]
        let gender
        const status = "Requested"
        let service_name
        let category_name
        const result: PromoDiscountResult[] = []

        //@ts-ignore
        const salon = await this.salonService.getId(salon_id) as SalonSI
        // const employees =  await this.employeeService.getEmpbyService()

        let totalDiscountGiven = 0
        let promoCode: PromoCodeSI

        if (promo_code !== null) {

            promoCode = await this.promoUserService.getOne({ promo_code }) as PromoCodeSI

            if (promoCode.active === false) throw new Error(`Promo code not active anymore`)
            const currentDateTime = moment(Date.now())
            // time check
            if (!currentDateTime.isBefore(promoCode.expiry_date_time)) throw new Error(`Promo code is expired`)
            if (promoCode.time_type === 'Custom') {

                const currentDay = currentDateTime.day()
                const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
                if (!promoCode.custom_time_days.includes(currentDay)) throw new Error(`This promo code is not valid on ${DAYS[currentDay]}`)
                if (!currentDateTime.isBetween(promoCode.custom_time_start_time, promoCode.custom_time_end_time)) throw new Error(`This promo code is valid between ${promoCode.custom_time_start_time} and ${promoCode.custom_time_end_time}`)
            }
            if (promoCode.user_ids && promoCode?.user_ids?.length > 0) {
                if (!promoCode.user_ids.includes(userId)) throw new Error(`Current user doe not support this coupon code`)
            }
            const promoUserCount = await this.promoUserService.get({ promo_code_id: promoCode._id.toString(), user_id: userId }) as PromoUserSI[]
            // if  max_usage is -1 it means unlimited times
            if ((promoCode.max_usage !== -1) && promoCode.max_usage <= promoUserCount?.length) throw new Error(`You have exceeded the max usage: ${promoCode.max_usage}`)
            // check for the salon
            const cart = await this.cartService.getId(cart_id) as CartSI
            if (cart === null) throw new Error(`Not able find cart with this id`)
            // minimum bill check
            if (cart.total < promoCode.minimum_bill) throw new Error(`You cannot apply this coupon code. Minimum bill should be ${promoCode.minimum_bill}`)
            if (promoCode.salon_ids && promoCode.salon_ids?.length > 0) {
                //@ts-ignore
                if (!promoCode.salon_ids.includes(cart.salon_id._id)) throw new Error(`This coupon code is not applied on this salon`)
            }

            if (salon === null) throw new Error(`Salon not found from the cart`)
            for (let salonService of salon.services) {
                const salonOptionIds = salonService.options.map(o => o._id.toString())
                let i = 0
                while (i < cart.options.length && totalDiscountGiven < promoCode.discount_cap) {
                    const cartOpt = cart.options[i]
                    const salonOptionIndex = salonOptionIds.indexOf(cartOpt.option_id)
                    if (salonOptionIndex > -1 && (promoCode.categories?.length === 0 || (promoCode.categories?.length > 0 && promoCode.categories?.includes(salonService.category)))) {
                        const salonOption = salonService.options[salonOptionIndex]
                        if (promoCode.discount_type === 'Flat Price') {
                            const { flat_price } = promoCode
                            // calculating the discount which we can give
                            let discountApplicable = (salonOption.price < flat_price) ? salonOption.price : flat_price
                            discountApplicable = (discountApplicable > (promoCode.discount_cap - totalDiscountGiven)) ? (promoCode.discount_cap - totalDiscountGiven) : discountApplicable
                            const discount: PromoDiscountResult = {
                                option_id: cartOpt.option_id,
                                before_discount_price: salonOption.price,
                                discount: discountApplicable,
                                after_discount_price: salonOption.price - discountApplicable,
                                category_name: salonService.category
                            }
                            totalDiscountGiven += discountApplicable
                            result.push(discount)
                        } else {
                            const { discount_percentage } = promoCode
                            const discountInNumber = parseInt((salonOption.price * (discount_percentage / 100)).toString())
                            let discountApplicable = (salonOption.price < discountInNumber) ? salonOption.price : discountInNumber
                            discountApplicable = (discountApplicable > (promoCode.discount_cap - totalDiscountGiven)) ? (promoCode.discount_cap - totalDiscountGiven) : discountApplicable
                            const discount: PromoDiscountResult = {
                                option_id: cartOpt.option_id,
                                before_discount_price: salonOption.price,
                                discount: discountApplicable,
                                after_discount_price: salonOption.price - discountApplicable,
                                category_name: salonService.category
                            }
                            totalDiscountGiven += discountApplicable
                            result.push(discount)
                        }
                        cart.options.splice(i, 1)

                    } else {
                        i++
                    }
                }
            }
        }
        const discountOptionIds = result.map(r => r.option_id)
        let nextDateTime: moment.Moment
        // let day = moment(date_time).day() - 1
        // if (day < 0) day = 6
        // const starting_hours = salon.start_working_hours
        // const ending_hours = salon.end_working_hours
        // const selectedStartingHour = moment(starting_hours[day]).get("hours")
        // const selectedEndingHour = moment(ending_hours[day]).get("hours")
        // if (moment().get("hours") < (selectedStartingHour) && moment().hours() > (selectedEndingHour)) {
        //     console.log("time changed due to salon offline")
        //     status = "Confirmed"
        // } else {
        //     status = "Requested"
        // }
        for (let o of options) {
            for (let salonService of salon.services) {
                const salonOptionIndex = salonService.options.map(o => o._id?.toString()).indexOf(o.option_id)
                const discountIndex = discountOptionIds.indexOf(o.option_id)
                // TODO: BUG Discount code not applying
                console.log(`salonOptionIndex: ${salonOptionIndex}`)
                if (salonOptionIndex > -1) {
                    o.service_name = salonService.name
                    o.category_name = salonService.category
                    o.gender = salonService.options[salonOptionIndex].gender

                    if (discountIndex > -1) o.discount_given = result[discountIndex].discount
                    break
                }

            }

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
            if (!o.employee_id || o.employee_id === null) {

                if (!employeeIds || employeeIds?.length === 0) {

                    if (salon === null) {
                        // throw new ErrorResponse(`No salon found with salon id ${salon_id}`)
                    }
                    employeeIds = (salon?.employees as EmployeeSI[] ?? []).map((e: EmployeeSI) => e._id.toString())
                }
                for (let i = 0; i < employeeIds.length; i++) {
                    // TODO: check if employee has the service
                    const empId = employeeIds[i]
                    const mongooseDateTime = service_time.toISOString()
                    const empBookings = await this.service.get({ "services.employee_id": mongoose.Types.ObjectId(empId), "services.service_time": mongooseDateTime })
                    if (empBookings.length > 0) continue
                    console.log("empBookings")
                    console.log(empBookings)

                    const empAbs = await this.employeeAbsentismService.get({ "employee_id": mongoose.Types.ObjectId(empId), absenteeism_date: service_time.format(moment.HTML5_FMT.DATE) }) as EmployeeAbsenteeismSI[]
                    if (empAbs.length > 0) {
                        console.log("empAbs")
                        console.log(empAbs)
                        for (let j = 0; j < empAbs.length; j++) {
                            const empAb = empAbs[j]
                            let absent = false
                            for (let empAbTime of empAb.absenteeism_times) {
                                console.log("empAbTime", empAbTime)
                                console.log("dateTime.format('h:mm A')", service_time.format('h:mm A'))
                                if (empAbTime === service_time.format('h:mm A')) {
                                    absent = true
                                    break
                                }
                            }
                            if (absent === false) {
                                o.employee_id = empId
                                break
                            }
                        }
                    } else {
                        o.employee_id = empId
                    }
                    if (o.employee_id) {
                        break
                    }
                }
            }
            if (!o.employee_id || o.employee_id === null) {
                //      throw new ErrorResponse(`No employee found at this time for the service`)
            }
        }
        console.log("optionsss")
        console.log(options)
        const booking = await this.service.bookAppointment(userId, payment_method, location, date_time, salon_id, options, address, promo_code, status)

        // const employeeReq = this.employeeService.getId(options[0].employee_id)
        // const userReq = this.userService.getId(userId) as UserI
        // const [employee, user] = await Promise.all([employeeReq, userReq])
        // const vendor = await this.vendorService.getId(salon.vendor_id)
        // const bookingTime = moment(booking.services[0].service_time).format('MMMM Do YYYY, h:mm a');
        // if promocode applied then add to database that user used the promocode
        if (totalDiscountGiven > 0 && promoCode) {
            await this.promoUserService.post({ promo_code_id: promoCode._id.toString(), user_id: userId })
        }
        // try {
        //     const notify = Notify.bookingRequest(vendor, employee, salon, booking, user)
        //     console.log(notify)
        // } catch (error) {
        //     console.log(error)
        // }


        res.send(booking);
    })

    getSalonEmployees = controllerErrorHandler(async (req: Request, res: Response) => {
        const services = req.body.services
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
        const employee = await this.employeeService.getEmpbyService(services) as EmployeeSI[]
        const employee_ids = employee.map(e => { return e._id })
        const employeeAbsent = await this.employeeAbsentismService.checkIfEmployeeAbsent(employee_ids, req.query.dateTime.toString())
        const getEmp = await this.employeeService.getByIds(employeeAbsent) as EmployeeSI[]
        const salon = await this.service.getSalonEmployees(req.params.salonId, new Date(req.query.dateTime.toString()), getEmp)


        if (salon === null) {
            const errMsg = `salon not found`;
            logger.error(errMsg);
            res.status(400);
            res.send({ message: errMsg });
        }
        res.send(salon);

    })

    // this to verify the razorpay payment








    verifyRazorPayPayment = controllerErrorHandler(async (req: Request, res: Response) => {
        //@ts-ignore
        const userId = req.userId
        const { bookingId } = req.params
        const { order_id, payment_id, signature } = req.body
        const booking = await this.service.getOne({ _id: mongoose.Types.ObjectId(bookingId), user_id: userId, razorpay_order_id: order_id }) as BookingSI
        if (booking === null) throw new ErrorResponse({ message: "Booking not found with the given data" })
        const razorpayPaymentData: RazorpayPaymentData = {
            order_id,
            payment_id,
            signature,
            verified: false
        }
        booking.razorpay_payment_data = razorpayPaymentData
        await booking.save()
        res.send({ message: booking.razorpay_payment_data, success: true })
    })

    getEmployeebyService = controllerErrorHandler(async (req: Request, res: Response) => {
        const services = req.body.services
        const employee = await this.employeeService.getEmpbyService(services) as EmployeeSI[]
        res.send(employee)
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
        const status: BookinStatus = req.body.status
        let authorName
        let id
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
        //@ts-ignore
        if (!req.userId) {
            authorName = "User"
            //@ts-ignore
            id = req.userId

        }
        //@ts-ignore
        if (!req.vendorId) {
            authorName = "Vendor"
            //@ts-ignore
            id = req.vendorId

        }
        //@ts-ignore
        if (!req.adminId) {
            authorName = "Admin"
            //@ts-ignore
            id = req.adminId
        }
        const booking = await this.service.updateStatusBookings(bookingid, status, authorName, id)
        if (!booking) {
            const errMsg = 'No Bookings Found'
            logger.error(errMsg)
            res.status(400)
            res.send({ message: errMsg })
            return
        }
        const userData = this.userService.getId(booking.user_id.toString())
        const salonData = this.salonService.getId(booking.salon_id.toString())
        const employeeData = this.employeeService.getId(booking.services[0].employee_id.toString())
        const [user, salon, employee] = await Promise.all([userData, salonData, employeeData])
        let refundToWallet = false

        const bookingTime = moment(booking.services[0].service_time).format('MMMM Do YYYY, h:mm a');
        if (status === "Confirmed") {

            const notify = Notify.bookingConfirm(user, salon, employee, booking)
            console.log(notify)
        }
        if (status === "Start") {
            const notify = Notify.serviceStart(user.phone, user.email, user.fcm_token, salon.contact_number, salon.email, salon.name, employee.phone, employee.fcm_token, booking.id, booking.booking_numeric_id.toString(), bookingTime)
        }
        if (status === "Done") {
            const notify = Notify.serviceEnd(user.phone, user.email, user.fcm_token, salon.contact_number, salon.email, salon.name, employee.phone, employee.fcm_token, booking.id, booking.booking_numeric_id.toString(), bookingTime)
        }
        if (status === 'Vendor Cancelled') {
            const notify = Notify.vendorCancelled(user, salon, employee, booking)
        }

        if (status === "Completed") {
            const notify = Notify.bookingCompletedInvoice(user, salon, booking, employee)
            const completedBooking = await this.service.get({ user_id: booking.user_id.toString(), status: "Completed" })

            if (completedBooking.length === 1) {
                console.log(booking.user_id.toString())
                const referal: ReferralSI = await this.referralService.getReferralByUserIdAndUpdate(booking.user_id.toString(), { "referred_to.booking_id": booking._id, "referred_to.booking_status": status })
                console.log(referal)
                if (!referal) {
                    console.log("no referral")
                } else {
                    const sqsWalletTransactionDataRefferedTo: SQSWalletTransactionI = {
                        transaction_type: "Referral Bonus",
                        user_id: referal.referred_by.toString() // add money to this person account
                    }
                    const sqsWalletTransactionDataRefferedBy: SQSWalletTransactionI = {
                        transaction_type: "Referral Bonus",
                        user_id: referal.referred_to.toString() // add money to  person account who shared
                    }
                    sqsWalletTransaction(sqsWalletTransactionDataRefferedTo)
                    sqsWalletTransaction(sqsWalletTransactionDataRefferedBy)
                    const referred_by_req = this.userService.getId(referal.referred_by.toString())
                    const referred_to_req = this.userService.getId(referal.referred_to.toString())
                    const [referred_by,referred_to] = await Promise.all([referred_by_req,referred_to_req])
                    const notify = Notify.referralComplete(referred_by,referred_to)
                }
            }
        }
        const cancelledStatuses: BookinStatus[] = ['Customer Cancelled', 'Customer Cancelled After Confirmed', 'No Show', 'Online Payment Failed', 'Rescheduled Canceled', 'Vendor Cancelled After Confirmed', 'Vendor Cancelled']
        if (cancelledStatuses.includes(status)) {
            refundToWallet = true
        }
        if (refundToWallet === true) {
            const walletPaymentIndex = booking.payments.map(p => p.mode).indexOf(BookingPaymentMode.WALLET)
            if (walletPaymentIndex > -1) {
                let bookingTotalPrice = booking.services.map((s: BookingServiceI) => s.service_total_price).reduce((a: number, b: number) => a + b)
                bookingTotalPrice = bookingTotalPrice + (bookingTotalPrice * 0.18)
                bookingTotalPrice = parseFloat(bookingTotalPrice.toFixed(2))
                const refund: RefundI = {
                    type: RefundTypeEnum.Zattire_Wallet,
                    status: "Initiated",
                    total_amount: bookingTotalPrice,
                    amount_refunded: booking.payments[walletPaymentIndex].amount,
                    zattire_commision: 0,
                    //@ts-ignore
                    user_id: booking?.user_id?._id?.toString() ?? booking.user_id.toString(),
                    //@ts-ignore
                    salon_id: (booking.salon_id?._id ?? booking.salon_id).toString(),
                    booking_id: booking._id,
                }
                const refundSI = await this.refundService.post(refund)
                const sqsWalletTransactionData: SQSWalletTransactionI = {
                    transaction_type: "Refund",
                    refund_id: refundSI._id.toString()
                }
                sqsWalletTransaction(sqsWalletTransactionData)
            }
        }
        res.send({ message: "Booking status changed", success: true })
    })

    confirmRescheduleSlot = controllerErrorHandler(async (req: Request, res: Response) => {
        const bookingId = req.params.id
        const date_time = req.body.date_time
        //@ts-ignore
        const userId = req.userId
        var rescheduleditime = moment(date_time).toDate()
        const booking = await this.service.confirmRescheduleSlot(bookingId, rescheduleditime, userId)
        if (!booking) {
            const errMsg = 'No Bookings Found'
            logger.error(errMsg)
            res.status(400)
            res.send({ message: errMsg, success: false })
            return

        }
        const salonReq = this.salonService.getId(booking.salon_id.toString())
        const employeeReq = this.employeeService.getId(booking.services[0].employee_id)
        const userReq = this.userService.getId(userId)
        const [salon, employee, user] = await Promise.all([salonReq, employeeReq, userReq])
        const vendor = await this.vendorService.getId(salon.vendor_id)


        const notify = Notify.rescheduledBooking(vendor, user, booking, employee, salon)
        console.log(notify)
        res.send({ message: "Booking Confirmed", success: true })

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

        datetime.map(function (o) {
            return moment(o).toDate()
        })
        if (!id) {
            const errMsg = "Error Booking not found"
            logger.error(errMsg)
            res.status(400)
            res.send({ message: errMsg })
            return
        }
        const booking = await this.service.reschedulebooking(id, datetime, currentTime)
        if (booking === null) {
            const errMsg = "unable to update boooking"
            logger.error(errMsg)
            res.status(400)
            res.send({ message: errMsg })
            return

        }

        const userData = this.userService.getId(booking.user_id.toString())
        const salonData = this.salonService.getId(booking.salon_id.toString())
        const employeeData = this.employeeService.getId(booking.services[0].employee_id.toString())
        const [user, salon, employee] = await Promise.all([userData, salonData, employeeData])
        const bookingTime = moment(booking.services[0].service_time).format('MMMM Do YYYY, h:mm a');
        const notify = Notify.rescheduledPending(user.phone, user.email, user.fcm_token, salon.contact_number, salon.email, salon.name, employee.phone, employee.fcm_token, booking.id, booking.booking_numeric_id.toString(), bookingTime, user.name)
        console.log(notify)

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
        const q = req.query
        if (!salonId) {
            const errMsg = 'Salon Id not found'
            logger.error(errMsg)
            res.status(400)
            res.send({ message: errMsg })
            return
        }
        const bookings = await this.service.getAllSalonBookings(salonId, q)
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
        const { reason } = req.body
        const data = await this.service.cancelBooking(userId, bookingId, reason)

        const userReq = this.userService.getId(userId)
        const salonReq = this.salonService.getId(data.salon_id.toString())
        const [user, salon] = await Promise.all([userReq, salonReq])

        const notify = Notify.userCancelled(user, salon, data)
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
        const data: FeedbackI = req.body
        data.booking_id = bookingId
        const feedback = await this.feedbackService.post(data)
        res.send(feedback)
    })

    getBookingsAdmin = controllerErrorHandler(async (req: Request, res: Response) => {
        const q = req.query
        const booking = await this.service.getbookingsAdmin(q)
        res.send(booking)
    })

    bookAgain = controllerErrorHandler(async (req: Request, res: Response) => {
        const { booking_id } = req.body
        const cart = await this.service.bookAgain(booking_id)
        res.send(cart)
    })

    getAppointmentByUserID = controllerErrorHandler(async (req: Request, res: Response) => {
        //@ts-ignore
        const id = req.params.id
        const q = req.query
        const bookings = await this.service.getBookingByUserId(id,q)
        res.send(bookings)
    })



}
