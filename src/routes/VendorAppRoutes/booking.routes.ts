import { Router } from "express";
import EmployeeverifyToken from "../../middleware/Employee.jwt"
import Bookingservice from "../../service/VendorAppService/booking.service";
import VendorverifyToken from "../../middleware/VendorJwt";
const bookingRouter = Router()
const bs = new Bookingservice()



bookingRouter.get("/",VendorverifyToken,bs.getbookings)
bookingRouter.get("/reschedule/:id",VendorverifyToken,bs.rescheduleSlots)
bookingRouter.patch("/reschedule/:id",VendorverifyToken,bs.rescheduleBooking)
bookingRouter.patch("/updatetatus/:id",VendorverifyToken,bs.updateStatusBookings)

//employee
bookingRouter.get("/employee",EmployeeverifyToken,bs.getEmployeebookings)
bookingRouter.patch("/employee/updatetatus/:id",EmployeeverifyToken,bs.updateStatusBookings)
//bookingRouter.get("/employee/booking",EmployeeverifyToken,bs.getEmployeebookings)




export default bookingRouter