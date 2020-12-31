import { Router } from "express";
import CONFIG from "../../config";
import LoginController from "../../controller/login.controller";
import Admin from "../../models/admin.model";
import Booking from "../../models/booking.model";
import EmployeeAbsenteeism from "../../models/employeeAbsenteeism.model";
import Employee from "../../models/employees.model";
import Feedback from "../../models/feedback.model";
import Otp from "../../models/otp.model";
import ReportVendor from "../../models/reportVendor.model";
import Salon from "../../models/salon.model";
import User from "../../models/user.model";
import EmployeeService from "../../service/employee.service";
import LoginService from "../../service/login.service";
import OtpService from "../../service/otp.service";
import UserService from "../../service/user.service";

const loginRouter = Router()
const loginService = new LoginService(Admin)

const userService = new UserService(User, Booking)
const employeeService = new EmployeeService(Employee, EmployeeAbsenteeism, Salon, Feedback, ReportVendor, Booking)
const otpService = new OtpService(Otp, userService, employeeService)
const loginController = new LoginController(loginService, CONFIG.ADMIN_JWT_KEY, '30 days', otpService)

loginRouter.post("/create", loginController.create)
/**
 * @swagger
 * tags:
 *  name: AdminLogin
 *  description: This is to login as Admin and get the token
 * /api/login:
 *  post:
 *      tags: [AdminLogin]
 *      consumes:
 *          - application/json
 *      requestBody:
 *          description: Optional description in
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          username:
 *                              type: string
 *                              required: true
 *                          password:
 *                              type: string
 *                              required: true
 *      responses:
 *          default:
 *              description: Admin Login Response
 */
loginRouter.post("/", loginController.login)

export default loginRouter
