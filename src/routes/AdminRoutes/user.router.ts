import { Router } from "express";
import verifyToken from "../../middleware/jwt";
import UserService from "../../service/user.service";

import CONFIG from "../../config";
import User from "../../models/user.model";
import UserController from "../../controller/user.controller";
import Booking from "../../models/booking.model"
import FeedbackService from "../../service/feedback.service";
import Feedback from "../../models/feedback.model";
import OtpService from "../../service/otp.service";
import Otp from "../../models/otp.model";
import Employee from "../../models/employees.model";
import EmployeeService from "../../service/employee.service";
import EmployeeAbsenteeism from "../../models/employeeAbsenteeism.model";
import ReportVendor from "../../models/reportVendor.model";
import Salon from "../../models/salon.model";

const userRouter = Router()
const userService = new UserService(User,Booking)
const feedbackService = new  FeedbackService(Feedback)
const employeeService = new  EmployeeService(Employee,EmployeeAbsenteeism,Salon,Feedback,ReportVendor, Booking)
const otpService = new OtpService(Otp, userService, employeeService)
const userController= new UserController(userService,feedbackService,otpService)

userRouter.post("/", verifyToken, userController.post)
userRouter.get("/", verifyToken, userController.getWithPaginationtemp)
userRouter.get("/info/:id", verifyToken, userController.getId)
userRouter.put("/:id", verifyToken, userController.put)
userRouter.get("/search",userController.searchUsersByEmail)
userRouter.put("/:id/photo", verifyToken, userController.putPhoto)
userRouter.get("/:id/photo", verifyToken, userController.getPhoto)
userRouter.post("/send-notification",userController.sendNotificationToUsers)

export default userRouter
