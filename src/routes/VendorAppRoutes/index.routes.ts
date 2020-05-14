import { Router } from "express";

import employeeRouter from "./employee.routes"
import bookingRouter from "./booking.routes"



const VendorApprouter = Router();


VendorApprouter.use("/employee",employeeRouter)
VendorApprouter.use("/booking",bookingRouter)









export default VendorApprouter