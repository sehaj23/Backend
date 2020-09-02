import { Router } from "express";
import VendorverifyToken, { vendorJWTVerification } from "../../middleware/VendorJwt";
import EmployeeService from "../../service/employee.service";
import Employee from "../../models/employees.model";
import EmployeeAbsenteeism from "../../models/employeeAbsenteeism.model";
import Salon from "../../models/salon.model";
import EmployeeController from "../../controller/employee.controller";
import FeedbackVendor from "../../models/feedbackVendor.model"
import ReportVendor from "../../models/reportVendor.model"
const employeeRouter = Router()
const es = new EmployeeService(Employee, EmployeeAbsenteeism, Salon,FeedbackVendor,ReportVendor)
const ec = new EmployeeController(es)


employeeRouter.put("/edit/:id",VendorverifyToken,ec.put)

employeeRouter.get("/:id",VendorverifyToken,ec.getByIdWithService)

employeeRouter.patch("/add-service-by-category/:salonId/:employeeId",VendorverifyToken,ec.addServicesByCatgoryNames)

export default employeeRouter