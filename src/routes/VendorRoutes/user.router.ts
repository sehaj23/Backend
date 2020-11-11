import { Router } from "express";
import VendorverifyToken from "../../middleware/VendorJwt";
import UserService from "../../service/user.service";
import User from "../../models/user.model";

import LoginService from "../../service/login.service";
import CONFIG from "../../config";
import UserController from "../../controller/user.controller";
import Booking from "../../models/booking.model";
import FeedbackService from "../../service/feedback.service";
import Feedback from "../../models/feedback.model";
import EmployeeAbsenteeism from "../../models/employeeAbsenteeism.model";
import Employee from "../../models/employees.model";
import Otp from "../../models/otp.model";
import ReportVendor from "../../models/reportVendor.model";
import Salon from "../../models/salon.model";
import EmployeeService from "../../service/employee.service";
import OtpService from "../../service/otp.service";

const userRouter = Router()

const userService = new UserService(User,Booking)
const feedbackService = new  FeedbackService(Feedback)
const employeeService = new  EmployeeService(Employee,EmployeeAbsenteeism,Salon,Feedback,ReportVendor, Booking)
const otpService = new OtpService(Otp, userService, employeeService)
const userController= new UserController(userService,feedbackService,otpService)



userRouter.post("/", VendorverifyToken, userController.post)
userRouter.get("/", VendorverifyToken, userController.get)
userRouter.get("/:id", VendorverifyToken, userController.getId)
userRouter.put("/:id", VendorverifyToken, userController.put)
userRouter.put("/:id/photo", VendorverifyToken, userController.putPhoto)
userRouter.get("/:id/photo", VendorverifyToken, userController.getPhoto)

export default userRouter
