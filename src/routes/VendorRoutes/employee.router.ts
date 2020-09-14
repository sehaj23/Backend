import { Router } from "express";
import VendorverifyToken, { vendorJWTVerification } from "../../middleware/VendorJwt";
import EmployeeService from "../../service/employee.service";
import Employee from "../../models/employees.model";
import EmployeeAbsenteeism from "../../models/employeeAbsenteeism.model";
import Salon from "../../models/salon.model";
import EmployeeController from "../../controller/employee.controller";
import FeedbackVendor from "../../models/feedbackVendor.model"
import ReportVendor from "../../models/reportVendor.model"
import Booking from "../../models/booking.model";
import Otp from "../../models/otp.model";
import User from "../../models/user.model";
import OtpService from "../../service/otp.service";
import UserService from "../../service/user.service";
const employeeRouter = Router()
const es = new  EmployeeService(Employee,EmployeeAbsenteeism,Salon,FeedbackVendor,ReportVendor)
const us = new UserService(User, Booking)
const otpService = new OtpService(Otp, us, es)
const ec  = new EmployeeController(es, otpService)




employeeRouter.put("/edit/:id",VendorverifyToken,ec.put)

employeeRouter.get("/:id",VendorverifyToken,ec.getByIdWithService)

employeeRouter.patch("/add-service-by-category/:salonId/:employeeId",VendorverifyToken,ec.addServicesByCatgoryNames)

export default employeeRouter