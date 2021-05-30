import VendorController from "../../controller/vendor.controller";
import VendorService from "../../service/vendor.service";
import Vendor from "../../models/vendor.model";
import EmployeeAbsenteeism from "../../models/employeeAbsenteeism.model";
import { Router } from "express";
import VendorverifyToken from "../../middleware/VendorJwt";
import ReportVendor from "../../models/reportVendor.model";
import Feedback from "../../models/feedback.model"
import EmployeeService from "../../service/employee.service";
import Employee from "../../models/employees.model";
import Salon from "../../models/salon.model";
import Booking from "../../models/booking.model";
import EmployeeAbsenteesmService from "../../service/employee-absentism.service";


const vendorService = new VendorService(Vendor, EmployeeAbsenteeism,ReportVendor,Feedback)
const es = new  EmployeeService(Employee,EmployeeAbsenteeism,Salon,Feedback,ReportVendor, Booking)
const eas = new EmployeeAbsenteesmService(EmployeeAbsenteeism)

const vendorController = new VendorController(vendorService,es,eas)

const vendorRouter = Router()

vendorRouter.get("/", VendorverifyToken, vendorController.vendorInfo)

export default vendorRouter