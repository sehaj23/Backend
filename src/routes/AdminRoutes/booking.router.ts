import { Router } from "express";
import verifyToken from "../../middleware/jwt";

import BookinkService from "../../service/booking.service";
import Booking from "../../models/booking.model"
import BookingController from "../../controller/booking.controller";
import Salon from "../../models/salon.model";
import SalonService from "../../service/salon.service";
import Employee from "../../models/employees.model";
import Vendor from "../../models/vendor.model";
import Offer from "../../models/offer.model";
import EmployeeAbsentismService from "../../service/employee-absentism.service";
import employeeAbsenteeism from "../../models/employeeAbsenteeism.model";
import Event from "../../models/event.model";
import Review from "../../models/review.model";
import Brand from "../../models/brands.model";
import CartService from "../../service/cart.service";
import Cart from "../../models/cart.model";
import ReportSalon from "../../models/reportSalon.model"
import MongoCounter from "../../models/mongo-counter.model";
import MongoCounterService from "../../service/mongo-counter.service";
import BookingService from "../../service/booking.service";
import FeedbackService from "../../service/feedback.service";
import Feedback from "../../models/feedback.model";
import UserService from "../../service/user.service";
import User from "../../models/user.model";
import EmployeeService from "../../service/employee.service";
import EmployeeAbsenteeism from "../../models/employeeAbsenteeism.model";
import ReportVendor from "../../models/reportVendor.model";
import VendorService from "../../service/vendor.service";
import PromoCode from "../../models/promo-code.model";
import PromoUserService from "../../service/promo-user.service";
import ReferralService from "../../service/referral.service";
import Referral from "../../models/referral.model";

const bookingRouter = Router()
const cartService = new CartService(Cart, Salon)
const mongoCounterService = new MongoCounterService(MongoCounter)
const referralService =  new ReferralService(Referral)
const bookingService = new BookingService(Booking, Salon, cartService, mongoCounterService,Referral)
const feedbackService = new  FeedbackService(Feedback)
const userService = new UserService(User,Booking)
const employeeService = new  EmployeeService(Employee,EmployeeAbsenteeism,Salon,Feedback,ReportVendor, Booking)
const salonService = new SalonService(Salon, Employee, Vendor, Event, Offer, Review, Booking, Brand,ReportSalon)
const employeeAbsenteesimService = new EmployeeAbsentismService(employeeAbsenteeism)
const vendorService = new VendorService(Vendor,EmployeeAbsenteeism,ReportVendor,Feedback)
const promoUserService = new PromoUserService(PromoCode)

const bookingController = new BookingController(bookingService,salonService, employeeAbsenteesimService, cartService,feedbackService,userService,employeeService,vendorService,promoUserService,referralService)


bookingRouter.post("/", verifyToken, bookingController.post)
bookingRouter.get("/", verifyToken, bookingController.getBookingsAdmin)
bookingRouter.get("/:id", verifyToken, bookingController.getbookingbyId)
bookingRouter.patch("/update-status/:id",verifyToken,bookingController.updateStatusBookings)
bookingRouter.put("/:id", verifyToken, bookingController.put)
bookingRouter.post("/salon-emp/:salonId", bookingController.getSalonEmployees)


export default bookingRouter
