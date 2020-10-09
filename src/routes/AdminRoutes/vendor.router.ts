import { Router } from "express";
import verifyToken from "../../middleware/jwt";
import VendorService from "../../service/vendor.service";
import VendorController from "../../controller/vendor.controller"
import Vendor from "../../models/vendor.model";
import EmployeeAbsenteeism from "../../models/employeeAbsenteeism.model";
import ReportVendor from "../../models/reportVendor.model";
import Feedback from "../../models/feedback.model"
import EmployeeService from "../../service/employee.service";
import Employee from "../../models/employees.model";
import Salon from "../../models/salon.model";

const vendorRouter = Router()
const vs = new VendorService(Vendor,EmployeeAbsenteeism,ReportVendor,Feedback)
const es = new  EmployeeService(Employee,EmployeeAbsenteeism,Salon,Feedback,ReportVendor)
const vendorController = new VendorController(vs,es)

vendorRouter.post("/", verifyToken, vendorController.post)
vendorRouter.get("/", verifyToken, vendorController.get)
vendorRouter.get("/:id", verifyToken, vendorController.getId)
vendorRouter.put("/:id", verifyToken, vendorController.put)

export default vendorRouter
