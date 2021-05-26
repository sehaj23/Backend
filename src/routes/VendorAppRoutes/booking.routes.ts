import { Router } from "express";
import BookingController from "../../controller/booking.controller";
import EmployeeverifyToken from "../../middleware/Employee.jwt";
import VendorverifyToken from "../../middleware/VendorJwt";
import Booking from "../../models/booking.model";
import Brand from "../../models/brands.model";
import Cart from "../../models/cart.model";
import EmployeeAbsenteeism from "../../models/employeeAbsenteeism.model";
import Employee from "../../models/employees.model";
import Event from "../../models/event.model";
import Feedback from "../../models/feedback.model";
import MongoCounter from "../../models/mongo-counter.model";
import Offer from "../../models/offer.model";
import PromoCode from "../../models/promo-code.model";
import Referral from "../../models/referral.model";
import Refund from "../../models/refund.model";
import ReportSalon from "../../models/reportSalon.model";
import ReportVendor from "../../models/reportVendor.model";
import Review from "../../models/review.model";
import Salon from "../../models/salon.model";
import User from "../../models/user.model";
import Vendor from "../../models/vendor.model";
import BookingService from "../../service/booking.service";
import CartService from "../../service/cart.service";
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


const bookingRouter = Router()
const cartService = new CartService(Cart, Salon)
const feedbackService = new FeedbackService(Feedback)
const mongoCounterService = new MongoCounterService(MongoCounter)
const referralService = new ReferralService(Referral)
const bookingService = new BookingService(Booking, Salon, cartService, mongoCounterService, Referral)
const userService = new UserService(User, Booking)
const employeeService = new EmployeeService(Employee, EmployeeAbsenteeism, Salon, Feedback, ReportVendor, Booking)
const salonService = new SalonService(Salon, Employee, Vendor, Event, Offer, Review, Booking, Brand, ReportSalon)
const employeeAbsenteesimService = new EmployeeAbsentismService(EmployeeAbsenteeism)
const vendorService = new VendorService(Vendor, EmployeeAbsenteeism, ReportVendor, Feedback)
const promoUserService = new PromoUserService(PromoCode)
const refundService = new RefundService(Refund, bookingService)
const promoCodeService = new PromoCodeService(PromoCode)
const bookingController = new BookingController(bookingService, salonService, employeeAbsenteesimService, cartService, feedbackService, userService, employeeService, vendorService, promoUserService, referralService, refundService,promoCodeService)



bookingRouter.get("/", VendorverifyToken, bookingController.getbookings)
bookingRouter.get("/info/:id", VendorverifyToken, bookingController.getbookingbyId)
bookingRouter.get("/reschedule/:id", VendorverifyToken, bookingController.rescheduleSlots)
bookingRouter.patch("/reschedule/:id", VendorverifyToken, bookingController.reschedulebooking)
bookingRouter.patch("/updatestatus/:id", VendorverifyToken, bookingController.updateStatusBookings)
bookingRouter.get("/status", VendorverifyToken, bookingController.bookingStatus)
bookingRouter.get("/photo/:id", VendorverifyToken, bookingController.getPhoto)


//employee
bookingRouter.get("/employee", EmployeeverifyToken, bookingController.getEmployeebookings) //salon id required
bookingRouter.patch("/employee/updatestatus/:id", EmployeeverifyToken, bookingController.updateStatusBookings) //booking id required
bookingRouter.get("/employee/reschedule/:id", EmployeeverifyToken, bookingController.rescheduleSlots)
bookingRouter.get("/employee/info/:id", EmployeeverifyToken, bookingController.getbookingbyId)
bookingRouter.patch("/employee/reschedule/:id", EmployeeverifyToken, bookingController.reschedulebooking)
//bookingRouter.get("/employee/booking",EmployeeverifyToken,bookingController.getEmployeebookings)
bookingRouter.get("/photo/:id", EmployeeverifyToken, bookingController.getPhoto)




export default bookingRouter