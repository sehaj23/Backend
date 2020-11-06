import { Router } from 'express'
import LoginService from '../../service/login.service'
import { loginChecks, signupChecks,emailChecks } from '../../validators/login-validator'
import mySchemaValidator from '../../middleware/my-schema-validator'
import { signupLimiter, loginLimiter } from '../../middleware/rate-limit'
import User from '../../models/user.model'
import LoginController from '../../controller/login.controller'
import CONFIG from '../../config'
import OtpService from '../../service/otp.service'
import Otp from '../../models/otp.model'
import Booking from '../../models/booking.model'
import EmployeeAbsenteeism from '../../models/employeeAbsenteeism.model'
import Employee from '../../models/employees.model'
import Feedback from '../../models/feedback.model'
import ReportVendor from '../../models/reportVendor.model'
import Salon from '../../models/salon.model'
import EmployeeService from '../../service/employee.service'
import UserService from '../../service/user.service'

const loginRouter = Router()
const loginService = new LoginService(User)
const userService = new UserService(User, Booking)
const employeeService = new EmployeeService(Employee, EmployeeAbsenteeism, Salon, Feedback, ReportVendor, Booking)
const otpService = new OtpService(Otp, userService, employeeService)
const loginController = new LoginController(loginService, CONFIG.USER_JWT, '30 days', otpService)

// @ts-ignore
loginRouter.post(
  '/',
  loginLimiter,
  [loginChecks, mySchemaValidator],
  loginController.login
)

loginRouter.post(
  '/otp-signup-send',
  loginController.signupWithOtpSendOtp
)

loginRouter.post(
  '/otp-signup-verify',
  loginController.signupWithOtpVerifyOtp
)

loginRouter.post(
  '/otp-login-send',
  loginController.loginWithOtpSendOtp
)

loginRouter.post(
  '/otp-login-verify',
  loginController.loginWithOtpVerifyOtp
)

loginRouter.get("/pass/:password", loginController.getEncryptedPass)

loginRouter.post('/forgot-password-send',loginController.forgotPasswordSendEmail)

loginRouter.post('/forgot-password-verify',loginController.forgotPasswordVerifyEmail)



//@ts-ignore
loginRouter.post(
  '/create',
  signupLimiter,
  [signupChecks, mySchemaValidator],
  loginController.create
)

//@ts-ignore
loginRouter.post(
  '/google',
  loginController.loginwithGoogle
)

export default loginRouter
