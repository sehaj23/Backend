import { Router } from "express"
import BookingController from "../../controller/booking.controller"
import UserverifyToken from "../../middleware/User.jwt"
import Booking from "../../models/booking.model"
import Brand from "../../models/brands.model"
import Cart from "../../models/cart.model"
import EmployeeAbsenteeism from "../../models/employeeAbsenteeism.model"
import Employee from "../../models/employees.model"
import Event from "../../models/event.model"
import Feedback from "../../models/feedback.model"
import MongoCounter from "../../models/mongo-counter.model"
import Offer from "../../models/offer.model"
import PromoCode from "../../models/promo-code.model"
import Referral from "../../models/referral.model"
import ReportSalon from "../../models/reportSalon.model"
import ReportVendor from "../../models/reportVendor.model"
import Review from "../../models/review.model"
import Salon from "../../models/salon.model"
import User from "../../models/user.model"
import Vendor from "../../models/vendor.model"
import BookingService from "../../service/booking.service"
import CartService from "../../service/cart.service"
import EmployeeAbsenteesmService from "../../service/employee-absentism.service"
import EmployeeService from "../../service/employee.service"
import FeedbackService from "../../service/feedback.service"
import MongoCounterService from "../../service/mongo-counter.service"
import PromoUserService from "../../service/promo-user.service"
import ReferralService from "../../service/referral.service"
import SalonService from "../../service/salon.service"
import UserService from "../../service/user.service"
import VendorService from "../../service/vendor.service"
import { BookingValidator } from "../../validators/booking.validator"


const cartService = new CartService(Cart, Salon)
const feedbackService = new FeedbackService(Feedback)
const mongoCounterService = new MongoCounterService(MongoCounter)
const referralService = new ReferralService(Referral)
const bookingService = new BookingService(Booking, Salon, cartService, mongoCounterService, Referral)
const salonService = new SalonService(Salon, Employee, Vendor, Event, Offer, Review, Booking, Brand, ReportSalon)
const userService = new UserService(User, Booking)
const employeeService = new EmployeeService(Employee, EmployeeAbsenteeism, Salon, Feedback, ReportVendor, Booking)
const empAbsenteesimService = new EmployeeAbsenteesmService(EmployeeAbsenteeism)
const vendorService = new VendorService(Vendor, EmployeeAbsenteeism, ReportVendor, Feedback)
const promoUserService = new PromoUserService(PromoCode)


const bc = new BookingController(bookingService, salonService, empAbsenteesimService, cartService, feedbackService, userService, employeeService, vendorService, promoUserService, referralService)
const bookingRouter = Router()

// get available employees by date & time
bookingRouter.get("/", UserverifyToken, bc.getAppointment)
bookingRouter.get("/:id", UserverifyToken, bc.getId)
//bookingRouter.get("/online-cancelled", UserverifyToken, bc.getOnlineCancelledBookings)
bookingRouter.post("/check-cod/",UserverifyToken,bc.checkCod)
bookingRouter.get("/razorpay-orderid/:id", UserverifyToken, bc.getRazorpayOrderId)
//bookingRouter.post("/razorpay-verify-payment/:id", [...BookingValidator.verifyRazorPayPayment, UserverifyToken], bc.verifyRazorPayPayment)
bookingRouter.patch("/update-status/:id", UserverifyToken, bc.updateStatusBookings)
bookingRouter.patch("/rescheduled/:id", UserverifyToken, bc.confirmRescheduleSlot)
// create a booking
bookingRouter.post("/", UserverifyToken, bc.bookAppointment)
bookingRouter.post("/employees/:salonId", UserverifyToken, bc.getSalonEmployees)

bookingRouter.patch("/cancel/:bookingId", UserverifyToken, bc.cancelBooking)
bookingRouter.post("/feedback/:id", UserverifyToken, bc.bookingFeedback)
bookingRouter.post("/book-again", UserverifyToken, bc.bookAgain)
bookingRouter.post("/employee-service", UserverifyToken, bc.getEmployeebyService)


export default bookingRouter
