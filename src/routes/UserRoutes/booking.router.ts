import { Router } from "express"

import Booking from "../../models/booking.model"
import Salon from "../../models/salon.model"
import BookingController from "../../controller/booking.controller"
import SalonService from "../../service/salon.service"
import Employee from "../../models/employees.model"
import Vendor from "../../models/vendor.model"
import Event from "../../models/event.model"
import Offer from "../../models/offer.model"
import Review from "../../models/review.model"
import Brand from "../../models/brands.model"
import EmployeeAbsenteesmService from "../../service/employee-absentism.service"
import EmployeeAbsenteeism from "../../models/employeeAbsenteeism.model"
import BookingService from "../../service/booking.service"
import UserverifyToken from "../../middleware/User.jwt"
import CartService from "../../service/cart.service"
import Cart from "../../models/cart.model"
import ReportSalon from "../../models/reportSalon.model"
import MongoCounter from "../../models/mongo-counter.model"
import MongoCounterService from "../../service/mongo-counter.service"

const cartService = new CartService(Cart, Salon)
const mongoCounterService = new MongoCounterService(MongoCounter)
const bookingService = new BookingService(Booking, Salon, cartService, mongoCounterService)
const salonService = new SalonService(Salon, Employee, Vendor, Event, Offer, Review, Booking, Brand,ReportSalon)
const empAbsenteesimService = new EmployeeAbsenteesmService(EmployeeAbsenteeism)
const bc = new BookingController(bookingService, salonService, empAbsenteesimService, cartService)
const bookingRouter = Router()

// get available employees by date & time
bookingRouter.get("/",UserverifyToken, bc.getAppointment)
bookingRouter.get("/:id",UserverifyToken, bc.getId)
bookingRouter.get("/razorpay-orderid/:id",UserverifyToken, bc.getRazorpayOrderId)
bookingRouter.patch("/update-status/:id", UserverifyToken, bc.updateStatusBookings)
bookingRouter.patch("/rescheduled/:id",UserverifyToken,bc.confirmRescheduleSlot)
// create a booking
bookingRouter.post("/",UserverifyToken, bc.bookAppointment)
bookingRouter.post("/employees/:salonId",UserverifyToken, bc.getSalonEmployees)

bookingRouter.patch("/cancel/:bookingId", UserverifyToken, bc.cancelBooking )

export default bookingRouter
