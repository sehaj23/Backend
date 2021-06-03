import { Router } from "express";
import UserController from "../../controller/user.controller";
import UserverifyToken from "../../middleware/User.jwt";
import Booking from "../../models/booking.model";
import EmployeeAbsenteeism from "../../models/employeeAbsenteeism.model";
import Employee from "../../models/employees.model";
import Feedback from "../../models/feedback.model";
import Otp from "../../models/otp.model";
import ReportVendor from "../../models/reportVendor.model";
import Salon from "../../models/salon.model";
import User from "../../models/user.model";
import EmployeeService from "../../service/employee.service";
import FeedbackService from "../../service/feedback.service";
import OtpService from "../../service/otp.service";
import UserService from "../../service/user.service";



const userRouter = Router()
const feedbackService = new  FeedbackService(Feedback)
const userService = new UserService(User,Booking)
const employeeService = new  EmployeeService(Employee,EmployeeAbsenteeism,Salon,Feedback,ReportVendor, Booking)
const otpService = new OtpService(Otp, userService, employeeService)
const userController= new UserController(userService,feedbackService,otpService)


userRouter.get("/info",UserverifyToken,userController.getUser)
userRouter.patch("/update",UserverifyToken,userController.update)
userRouter.put("/fcm-token",UserverifyToken,userController.updateFCM)
userRouter.patch("/fcm-token",UserverifyToken,userController.deleteFcm)
userRouter.patch("/password",UserverifyToken,userController.updatePassword)
userRouter.get("/bookings",UserverifyToken,userController.pastBooking)
userRouter.get("/address",UserverifyToken,userController.getAddress)
userRouter.post("/address",UserverifyToken,userController.addAddress)
userRouter.patch("/address/:addressId",UserverifyToken,userController.updateAddress)
userRouter.delete("/address/:addressId",UserverifyToken,userController.deleteAddress)
userRouter.put("/profile-photo",UserverifyToken,userController.putProfilePic)
userRouter.patch('/favourite',UserverifyToken,userController.addToFavourites)
userRouter.get('/favourite',UserverifyToken,userController.getFavourites)
userRouter.patch('/favourite/delete',UserverifyToken,userController.removeFavourites)
userRouter.post("/feedback",UserverifyToken,userController.postFeedback)
userRouter.post("/confirm-email",UserverifyToken,userController.emailConfirm)
userRouter.post("/confirm-email-verify",UserverifyToken,userController.emailVerify)
userRouter.post("/sendNotification",userController.sendNotifcation)
userRouter.post("/sendEmail",userController.sendEmail)
userRouter.get("/check-verfied",UserverifyToken,userController.checkEmailVerfied)
userRouter.post("/otp-email-verify",UserverifyToken,userController.emailConfirmAfterSignup)
userRouter.patch("/update-forgot-password",UserverifyToken,userController.updateForgotPassword)
userRouter.get("/delete-account",UserverifyToken,userController.deleteRequest)
userRouter.get("/version",userController.appVersion)
userRouter.get("/referral",UserverifyToken,userController.refferal)
userRouter.post('/referral-verify',userController.verifyReferral)

export default userRouter
