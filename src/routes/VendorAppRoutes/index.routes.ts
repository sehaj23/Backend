import { Router } from "express";

import employeeRouter from "./employee.routes"
import bookingRouter from "./booking.routes"
import vendorRouter from "./vendor.routes"



const VendorApprouter = Router();


VendorApprouter.use("/employee",employeeRouter)
VendorApprouter.use("/booking",bookingRouter)
VendorApprouter.use("/vendor",vendorRouter)









export default VendorApprouter