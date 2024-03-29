import { Router } from "express";
import ReportAppController from "../../controller/report-app.controller";
import ReportAppService from "../../service/report-app.service";
import ReportApp from "../../models/report-app.model";
import OtpService from "../../service/otp.service";
import Otp from "../../models/otp.model";
import UserService from "../../service/user.service";
import Booking from "../../models/booking.model";
import User from "../../models/user.model";
import EmployeeService from "../../service/employee.service";
import Employee from "../../models/employees.model";
import EmployeeAbsenteeism from "../../models/employeeAbsenteeism.model";
import Feedback from "../../models/feedback.model";
import ReportVendor from "../../models/reportVendor.model";
import Salon from "../../models/salon.model";
import OtpController from "../../controller/otp.controller";
import UserverifyToken from "../../middleware/User.jwt";

const otpAppRouter = Router()
const userService = new UserService(User, Booking)
const employeeService = new EmployeeService(Employee, EmployeeAbsenteeism, Salon, Feedback, ReportVendor, Booking)
const otpService = new OtpService(Otp, userService, employeeService)
const otpController = new OtpController(otpService)

otpAppRouter.post("/send", UserverifyToken, otpController.sendUserOtp)
otpAppRouter.post("/verify", UserverifyToken,otpController.verifyUserOtp)

export default otpAppRouter