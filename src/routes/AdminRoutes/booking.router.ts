import { Router } from "express";
import verifyToken from "../../middleware/jwt";

import BookinkService from "../../service/booking.service";
import Booking from "../../models/booking.model"
import BookingController from "../../controller/booking.controller";

const bookingRouter = Router()
const bookingService = new BookinkService(Booking)
const bookingController = new BookingController(bookingService)

bookingRouter.post("/", verifyToken, bookingController.post)
bookingRouter.get("/", verifyToken, bookingController.get)
bookingRouter.get("/:id", verifyToken, bookingController.getId)
bookingRouter.put("/:id", verifyToken, bookingController.put)
bookingRouter.post("/salon-emp/:salonId", bookingController.getSalonEmployees)


export default bookingRouter
