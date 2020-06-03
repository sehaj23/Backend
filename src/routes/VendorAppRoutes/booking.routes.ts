import { Router } from "express";
import EmployeeverifyToken from "../../middleware/Employee.jwt"
import Bookingservice from "../../service/VendorAppService/booking.service";
import VendorverifyToken from "../../middleware/VendorJwt";
const bookingRouter = Router()
const bs = new Bookingservice()



bookingRouter.get("/",VendorverifyToken,bs.getbookings)
bookingRouter.get("/reschedule/:id",VendorverifyToken,bs.rescheduleSlots)
bookingRouter.patch("/reschedule/:id",VendorverifyToken,bs.rescheduleBooking)
bookingRouter.get("/employee",EmployeeverifyToken,bs.getbookings)



export default bookingRouter