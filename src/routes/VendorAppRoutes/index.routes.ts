import { Router } from "express";

import employeeRouter from "./employee.routes"
import bookingRouter from "./booking.routes"
import vendorRouter from "./vendor.routes"
import revenueRouter from  "./revenue.routes"



const VendorApprouter = Router();


VendorApprouter.use("/employee",employeeRouter)
VendorApprouter.use("/booking",bookingRouter)
VendorApprouter.use("/vendor",vendorRouter)
VendorApprouter.use("/revenue",revenueRouter)









export default VendorApprouter