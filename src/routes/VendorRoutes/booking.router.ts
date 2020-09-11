import { Router } from "express";
import VendorverifyToken from "../../middleware/VendorJwt";
import BookinkService from "../../service/booking.service";
import BookingController from "../../controller/booking.controller";
import Booking from "../../models/booking.model";
import Salon from "../../models/salon.model";
import SalonService from "../../service/salon.service";
import Employee from "../../models/employees.model";
import Vendor from "../../models/vendor.model";
import Offer from "../../models/offer.model";
import EmployeeAbsentismService from "../../service/employee-absentism.service";
import EmployeeAbsenteeism from "../../models/employeeAbsenteeism.model";
import Event from "../../models/event.model";
import Review from "../../models/review.model";
import Brand from "../../models/brands.model";
import Cart from "../../models/cart.model";
import CartService from "../../service/cart.service";
import ReportSalon from "../../models/reportSalon.model"
import MongoCounterService from "../../service/mongo-counter.service";
import MongoCounter from "../../models/mongo-counter.model";
import BookingService from "../../service/booking.service";


const bookingRouter = Router()
const cartService = new CartService(Cart, Salon)
const mongoCounterService = new MongoCounterService(MongoCounter)
const bookingService = new BookingService(Booking, Salon, cartService, mongoCounterService)
const employeeAbsenteeism = new EmployeeAbsentismService(EmployeeAbsenteeism)
const salonService = new SalonService(Salon,Employee,Vendor,Event,Offer,Review,Booking,Brand,ReportSalon)
const bookingController = new BookingController(bookingService,salonService,employeeAbsenteeism, cartService)


// // bookingRouter.post("/", VendorverifyToken, bookingController.post)
// // bookingRouter.get("/:id", VendorverifyToken, bookingController.getId)
// // bookingRouter.get("/", VendorverifyToken, bookingController.getbookings) //filter can be used here
// // bookingRouter.put("/assignEmployee/:id", VendorverifyToken, bookingController.assigneEmployeeBookings)
bookingRouter.get("/all/salon/:id",VendorverifyToken,bookingController.getAllSalonBookings)  //test cases left
// // bookingRouter.get("/all/makeupArtist/:id",VendorverifyToken,bookingController.getAllMuaBookings) //test cases left
// // bookingRouter.get("/all/designer/:id",VendorverifyToken,bookingController.getAllDesignerBookings) //test cases left
// // bookingRouter.get("/salon/:id",VendorverifyToken,bookingController.getSalonBookings) // bookings except pending
// // bookingRouter.get("/makeupArtist/:id",VendorverifyToken,bookingController.getmakeupArtistBookings) //booking except pending
// // bookingRouter.get("/designer/:id",VendorverifyToken,bookingController.getDesignerBookings) // booking except pending
bookingRouter.get("/pending/salon/:id",VendorverifyToken,bookingController.getPendingSalonBookings)
// // bookingRouter.get("/pending/makeupArtist/:id",VendorverifyToken,bookingController.getPendingmakeupArtistBookings)
// // bookingRouter.get("/pending/designer/:id",VendorverifyToken,bookingController.getPendingDesignerBookings)
// // bookingRouter.patch("/updatestatus/:id",VendorverifyToken,bookingController.updateStatusBookings)
// // bookingRouter.patch("/reschedule/:id",VendorverifyToken,bookingController.reschedulebooking)


export default bookingRouter
