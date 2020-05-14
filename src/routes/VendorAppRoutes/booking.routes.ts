import { Router } from "express";
import Employeeverifytoken from "../../middleware/Employee.Jwt";
import Bookingservice from "../../service/VendorAppService/booking.service";
const bookingRouter = Router()
const bs = new Bookingservice()



bookingRouter.get("/",Employeeverifytoken,bs.getbookings)


export default bookingRouter