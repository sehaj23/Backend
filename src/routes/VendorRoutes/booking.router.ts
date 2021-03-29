import { Router } from "express";
import BookingController from "../../controller/booking.controller";
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
const employeeAbsenteeism = new EmployeeAbsentismService(EmployeeAbsenteeism)
const userService = new UserService(User, Booking)
const employeeService = new EmployeeService(Employee, EmployeeAbsenteeism, Salon, Feedback, ReportVendor, Booking)
const salonService = new SalonService(Salon, Employee, Vendor, Event, Offer, Review, Booking, Brand, ReportSalon)
const vendorService = new VendorService(Vendor, EmployeeAbsenteeism, ReportVendor, Feedback)
const promoUserService = new PromoUserService(PromoCode)
const refundService = new RefundService(Refund, bookingService)
const bookingController = new BookingController(bookingService, salonService, employeeAbsenteeism, cartService, feedbackService, userService, employeeService, vendorService, promoUserService, referralService, refundService)



// // bookingRouter.post("/", VendorverifyToken, bookingController.post)
bookingRouter.get("/:id", VendorverifyToken, bookingController.getFullBookingById)
bookingRouter.get("/", VendorverifyToken, bookingController.getbookings) //filter can be used here
// // bookingRouter.put("/assignEmployee/:id", VendorverifyToken, bookingController.assigneEmployeeBookings)
bookingRouter.get("/all/salon/:id", VendorverifyToken, bookingController.getAllSalonBookings)  //test cases left
// // bookingRouter.get("/all/makeupArtist/:id",VendorverifyToken,bookingController.getAllMuaBookings) //test cases left
// // bookingRouter.get("/all/designer/:id",VendorverifyToken,bookingController.getAllDesignerBookings) //test cases left
// // bookingRouter.get("/salon/:id",VendorverifyToken,bookingController.getSalonBookings) // bookings except pending
// // bookingRouter.get("/makeupArtist/:id",VendorverifyToken,bookingController.getmakeupArtistBookings) //booking except pending
// // bookingRouter.get("/designer/:id",VendorverifyToken,bookingController.getDesignerBookings) // booking except pending
bookingRouter.get("/pending/salon/:id", VendorverifyToken, bookingController.getPendingSalonBookings)
// // bookingRouter.get("/pending/makeupArtist/:id",VendorverifyToken,bookingController.getPendingmakeupArtistBookings)
// // bookingRouter.get("/pending/designer/:id",VendorverifyToken,bookingController.getPendingDesignerBookings)
bookingRouter.patch("/updatestatus/:id", VendorverifyToken, bookingController.updateStatusBookings)
// // bookingRouter.patch("/reschedule/:id",VendorverifyToken,bookingController.reschedulebooking)


export default bookingRouter
