import { Router } from "express";
import verifyToken from "../../middleware/jwt";
import LoginService from "../../service/login.service";
import Admin from "../../models/admin.model";
import LoginController from "../../controller/login.controller";
import CONFIG from "../../config";
import Booking from "../../models/booking.model";
import EmployeeAbsenteeism from "../../models/employeeAbsenteeism.model";
import Employee from "../../models/employees.model";
import Feedback from "../../models/feedback.model";
import Otp from "../../models/otp.model";
import ReportVendor from "../../models/reportVendor.model";
import Salon from "../../models/salon.model";
import User from "../../models/user.model";
import EmployeeService from "../../service/employee.service";
import OtpService from "../../service/otp.service";
import UserService from "../../service/user.service";

const loginRouter = Router()
const loginService = new LoginService(Admin)

const userService = new UserService(User, Booking)
const employeeService = new EmployeeService(Employee, EmployeeAbsenteeism, Salon, Feedback, ReportVendor, Booking)
const otpService = new OtpService(Otp, userService, employeeService)
const loginController = new LoginController(loginService, CONFIG.ADMIN_JWT_KEY, '30 days', otpService)

loginRouter.post("/create", loginController.create)
loginRouter.post("/",loginController.login)

export default loginRouter
