import { Router } from 'express'
import CONFIG from '../../config'
import LoginController from '../../controller/login.controller'
import mySchemaValidator from '../../middleware/my-schema-validator'
import { loginLimiter, signupLimiter } from '../../middleware/rate-limit'
import Booking from '../../models/booking.model'
import EmployeeAbsenteeism from '../../models/employeeAbsenteeism.model'
import Employee from '../../models/employees.model'
import Feedback from '../../models/feedback.model'
import Otp from '../../models/otp.model'
import PromoCode from '../../models/promo-code.model'
import Referral from '../../models/referral.model'
import ReportVendor from '../../models/reportVendor.model'
import Salon from '../../models/salon.model'
import User from '../../models/user.model'
import WalletTransaction from '../../models/wallet-transaction.model'
import EmployeeService from '../../service/employee.service'
import LoginService from '../../service/login.service'
import OtpService from '../../service/otp.service'
import PromoCodeService from '../../service/promo-code.service'
import ReferralService from '../../service/referral.service'
import UserService from '../../service/user.service'
import WalletTransactionService from '../../service/wallet-transaction.service'
import { loginChecks, signupChecks } from '../../validators/login-validator'

const loginRouter = Router()
const loginService = new LoginService(User)
const userService = new UserService(User, Booking)
const walletTransactionService = new WalletTransactionService(WalletTransaction, userService)
const employeeService = new EmployeeService(Employee, EmployeeAbsenteeism, Salon, Feedback, ReportVendor, Booking)
const otpService = new OtpService(Otp, userService, employeeService)
const referralService = new  ReferralService(Referral)
const promoCodeService = new PromoCodeService(PromoCode)
const loginController = new LoginController(loginService, CONFIG.USER_JWT, '365 days', otpService,referralService,promoCodeService,walletTransactionService)

loginRouter.post(
  '/',
  [loginLimiter, loginChecks, mySchemaValidator],
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

loginRouter.post('/forgot-password-send', loginController.forgotPasswordSendEmail)

loginRouter.post('/forgot-password-verify', loginController.forgotPasswordVerifyEmail)



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

//@ts-ignore
loginRouter.post(
  '/facebook',
  loginController.loginwithFacebook
)

loginRouter.post("/unique-phone",loginController.checkMobileUnique)

export default loginRouter
