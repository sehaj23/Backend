import VendorController from "../../controller/vendor.controller";
import VendorService from "../../service/vendor.service";
import Vendor from "../../models/vendor.model";
import EmployeeAbsenteeism from "../../models/employeeAbsenteeism.model";
import { Router } from "express";
import VendorverifyToken from "../../middleware/VendorJwt";
import ReportVendor from "../../models/reportVendor.model";
import FeedbackVendor from "../../models/feedbackVendor.model"
import EmployeeService from "../../service/employee.service";
import Employee from "../../models/employees.model";
import Salon from "../../models/salon.model";


const vendorService = new VendorService(Vendor, EmployeeAbsenteeism,ReportVendor,FeedbackVendor)
const es = new  EmployeeService(Employee,EmployeeAbsenteeism,Salon,FeedbackVendor,ReportVendor)

const vendorController = new VendorController(vendorService,es)

const vendorRouter = Router()

vendorRouter.get("/", VendorverifyToken, vendorController.vendorInfo)

export default vendorRouter