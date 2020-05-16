import { Router } from "express";
import EmployeeverifyToken from "../../middleware/Employee.jwt"
import Bookingservice from "../../service/VendorAppService/booking.service";
const bookingRouter = Router()
const bs = new Bookingservice()



bookingRouter.get("/",EmployeeverifyToken,bs.getbookings)


export default bookingRouter