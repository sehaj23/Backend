import { Router } from "express"
import bookingService from "../../service/UserService/booking.service"
import UserverifyToken from "../../middleware/User.jwt"
const bs = new bookingService()

const bookingRouter = Router()

// get available employees by date & time
bookingRouter.get("/ae", bs.getAvailableEmp)

// create a booking
bookingRouter.post("/create", bs.postBooking)

export default bookingRouter
