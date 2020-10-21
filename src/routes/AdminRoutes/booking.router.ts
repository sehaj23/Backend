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

const bookingRouter = Router()
const cartService = new CartService(Cart, Salon)
const mongoCounterService = new MongoCounterService(MongoCounter)
const bookingService = new BookingService(Booking, Salon, cartService, mongoCounterService)
const feedbackService = new  FeedbackService(Feedback)
const salonService = new SalonService(Salon, Employee, Vendor, Event, Offer, Review, Booking, Brand,ReportSalon)
const employeeAbsenteesimService = new EmployeeAbsentismService(employeeAbsenteeism)
const bookingController = new BookingController(bookingService,salonService, employeeAbsenteesimService, cartService,feedbackService)


bookingRouter.post("/", verifyToken, bookingController.post)
bookingRouter.get("/", verifyToken, bookingController.getBookingsAdmin)
bookingRouter.get("/:id", verifyToken, bookingController.getbookingbyId)
bookingRouter.patch("/update-status/:id",verifyToken,bookingController.updateStatusBookings)
bookingRouter.put("/:id", verifyToken, bookingController.put)
bookingRouter.post("/salon-emp/:salonId", bookingController.getSalonEmployees)


export default bookingRouter
