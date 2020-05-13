import { Router } from "express";

import employeeRouter from "./employee.routes"




const VendorApprouter = Router();


VendorApprouter.use("/employee",employeeRouter)








export default VendorApprouter