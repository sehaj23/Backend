import { Router } from "express";
import EmployeeService from "../../service/employee.service";
import EmployeeverifyToken, { employeeJWTVerification } from "../../middleware/Employee.jwt";
import EmployeeAbsenteeism from "../../models/employeeAbsenteeism.model";
import Employee from "../../models/employees.model";
import Salon from "../../models/salon.model";
import EmployeeController from "../../controller/employee.controller";
import Feedback from "../../models/feedback.model"
import ReportVendor from "../../models/reportVendor.model"
import OtpService from "../../service/otp.service";
import Otp from "../../models/otp.model";
import UserService from "../../service/user.service";
import Booking from "../../models/booking.model";
import User from "../../models/user.model";



const employeeRouter = Router()
const es = new  EmployeeService(Employee,EmployeeAbsenteeism,Salon,Feedback,ReportVendor)
const us = new UserService(User, Booking)
const otpService = new OtpService(Otp, us, es)
const employeeController  = new EmployeeController(es, otpService)


employeeRouter.post("/",employeeController.employeeLogin)
employeeRouter.post("/absent",EmployeeverifyToken,employeeController.employeeAbsent)
employeeRouter.post("/absent/update",EmployeeverifyToken,employeeController.employeeAbsentUpdate)
employeeRouter.get("/",EmployeeverifyToken ,employeeController.get)
employeeRouter.put("/", EmployeeverifyToken, employeeController.updateEmployee)
employeeRouter.put("/profile-pic", EmployeeverifyToken, employeeController.addProfilePic)
employeeRouter.get("/info",EmployeeverifyToken,employeeController.getEmp)
employeeRouter.get("/info/:id",EmployeeverifyToken,employeeController.getId)
employeeRouter.get("/employee-slots", EmployeeverifyToken, employeeController.employeeSlots)
employeeRouter.patch("/delete",EmployeeverifyToken,employeeController.employeeDelete)
employeeRouter.post("/feedback",EmployeeverifyToken,employeeController.feedback)
employeeRouter.post("/report",EmployeeverifyToken,employeeController.report)
employeeRouter.get("/service",EmployeeverifyToken,employeeController.empService)
employeeRouter.patch("/notification",EmployeeverifyToken,employeeController.notificationUpdate)

export default employeeRouter