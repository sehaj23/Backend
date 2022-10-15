import { Router } from "express";
import BookingController from "../../controller/booking.controller";
import verifyToken from "../../middleware/jwt";
import Booking from "../../models/booking.model";
import Brand from "../../models/brands.model";
import Cart from "../../models/cart.model";
import Cashbackuser from "../../models/cashback.model";
import Cashbackrange from "../../models/cashbackRange.model";
import { default as employeeAbsenteeism, default as EmployeeAbsenteeism } from "../../models/employeeAbsenteeism.model";
import Employee from "../../models/employees.model";
import Event from "../../models/event.model";
import Explore from "../../models/explore.model";
import Feedback from "../../models/feedback.model";
import FilterHome from "../../models/filterHome.model";
import MongoCounter from "../../models/mongo-counter.model";
import Offer from "../../models/offer.model";
import PromoCode from "../../models/promo-code.model";
import PromoUserCode from "../../models/promo-user.model";
import Referral from "../../models/referral.model";
import Refund from "../../models/refund.model";
import ReportSalon from "../../models/reportSalon.model";
import ReportVendor from "../../models/reportVendor.model";
import Review from "../../models/review.model";
import Salon from "../../models/salon.model";
import User from "../../models/user.model";
import Vendor from "../../models/vendor.model";
import WalletTransaction from "../../models/wallet-transaction.model";
import BookingService from "../../service/booking.service";
import CartService from "../../service/cart.service";
import CashbackRangeService from "../../service/cashback-range.service";
import CashbackService from "../../service/cashback.service";
import EmployeeAbsentismService from "../../service/employee-absentism.service";
import EmployeeService from "../../service/employee.service";
import FeedbackService from "../../service/feedback.service";
import MongoCounterService from "../../service/mongo-counter.service";
import PromoCodeService from "../../service/promo-code.service";
import PromoUserService from "../../service/promo-user.service";
import ReferralService from "../../service/referral.service";
import RefundService from "../../service/refund.service";
import SalonService from "../../service/salon.service";
import UserService from "../../service/user.service";
import VendorService from "../../service/vendor.service";
import WalletTransactionService from "../../service/wallet-transaction.service";


const bookingRouter = Router()
const cartService = new CartService(Cart, Salon,Explore)
const mongoCounterService = new MongoCounterService(MongoCounter)
const referralService = new ReferralService(Referral)
const userService = new UserService(User, Booking)
const walletTransactionService: WalletTransactionService = new WalletTransactionService(WalletTransaction, userService)
const bookingService = new BookingService(Booking, Salon, cartService, mongoCounterService, Referral, walletTransactionService)
const feedbackService = new FeedbackService(Feedback)
const employeeService = new EmployeeService(Employee, EmployeeAbsenteeism, Salon, Feedback, ReportVendor, Booking)
const salonService = new SalonService(Salon, Employee, Vendor, Event, Offer, Review, Booking, Brand, FilterHome, ReportSalon)
const employeeAbsenteesimService = new EmployeeAbsentismService(employeeAbsenteeism)
const vendorService = new VendorService(Vendor, EmployeeAbsenteeism, ReportVendor, Feedback)
const promoUserService = new PromoUserService(PromoUserCode)
const refundService = new RefundService(Refund, bookingService, walletTransactionService)
const promoCodeService = new PromoCodeService(PromoCode)
const cashbackRangeService =  new CashbackRangeService(Cashbackrange)
const cashbackService =  new CashbackService(Cashbackuser)
const bookingController = new BookingController(bookingService, salonService, employeeAbsenteesimService, cartService, feedbackService, userService, employeeService, vendorService, promoUserService, referralService, refundService, promoCodeService, walletTransactionService,cashbackRangeService ,cashbackService)


bookingRouter.post("/", verifyToken, bookingController.post)
bookingRouter.get("/", verifyToken, bookingController.getBookingsAdmin)
bookingRouter.get("/all", verifyToken, bookingController.get)
bookingRouter.get("/user/:id", verifyToken, bookingController.getAppointmentByUserID)
bookingRouter.get("/:id", verifyToken, bookingController.getbookingbyId)
bookingRouter.patch("/update-status/:id", verifyToken, bookingController.updateStatusBookings)
bookingRouter.put("/:id", verifyToken, bookingController.put)
/**
 * @swagger
 * /api/booking/salon-emp/:salonId:
 *  post:
 *      summary: Get list of employees available by service and booking date and time
 *      tags: [Admin]
 *      description: To get list and details of employees
 *      parameters:
 *         -in:query
 *           name:dateTime
 *           schema:
 *              type: string  
 *      requestBody:
 *          description: send service id in array
 *          content:
 *             application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          service_id:
 *                              type: [string]
 *                              required: true
 *      responses:
 *          default:
 *              description: Employee names and _ids.
 */
bookingRouter.post("/salon-emp/:salonId", bookingController.getSalonEmployees)


export default bookingRouter
