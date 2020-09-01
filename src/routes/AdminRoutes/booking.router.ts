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

const bookingRouter = Router()
const bookingService = new BookinkService(Booking,Salon)
const salonService = new SalonService(Salon, Employee, Vendor, Event, Offer, Review, Booking, Brand)
const employeeAbsenteesimService = new EmployeeAbsentismService(employeeAbsenteeism)
const cartService = new CartService(Cart, Salon)
const bookingController = new BookingController(bookingService,salonService, employeeAbsenteesimService, cartService)


bookingRouter.post("/", verifyToken, bookingController.post)
bookingRouter.get("/", verifyToken, bookingController.get)
bookingRouter.get("/:id", verifyToken, bookingController.getId)
bookingRouter.put("/:id", verifyToken, bookingController.put)
bookingRouter.post("/salon-emp/:salonId", bookingController.getSalonEmployees)


export default bookingRouter
