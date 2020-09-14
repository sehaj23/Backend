import { Router } from "express";

import employeeRouter from "./employee.routes"
import bookingRouter from "./booking.routes"
import vendorRouter from "./vendor.routes"
import revenueRouter from  "./revenue.routes"
import otpAppRouter from "./otp.route";

const VendorApprouter = Router();

VendorApprouter.use("/employee",employeeRouter)
VendorApprouter.use("/booking",bookingRouter)
VendorApprouter.use("/vendor",vendorRouter)
VendorApprouter.use("/revenue",revenueRouter)
VendorApprouter.use("/otp",otpAppRouter)

export default VendorApprouter