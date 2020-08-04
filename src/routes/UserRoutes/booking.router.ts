import { Router } from "express"
import BookingService from "../../service/UserService/booking.service"
const bs = new BookingService()

const bookingRouter = Router()

// get available employees by date & time
bookingRouter.get("/ae", bs.getAvailableEmp)

// create a booking
bookingRouter.post("/create", bs.postBooking)

export default bookingRouter
