import { Router } from "express";
import CONFIG from "../../config";
import LoginController from "../../controller/login.controller";
import Admin from "../../models/admin.model";
import Booking from "../../models/booking.model";
import EmployeeAbsenteeism from "../../models/employeeAbsenteeism.model";
import Employee from "../../models/employees.model";
import Feedback from "../../models/feedback.model";
import Otp from "../../models/otp.model";
import PromoCode from "../../models/promo-code.model";
import Referral from "../../models/referral.model";
import ReportVendor from "../../models/reportVendor.model";
import Salon from "../../models/salon.model";
import User from "../../models/user.model";
import WalletTransaction from "../../models/wallet-transaction.model";
import EmployeeService from "../../service/employee.service";
import LoginService from "../../service/login.service";
import OtpService from "../../service/otp.service";
import PromoCodeService from "../../service/promo-code.service";
import ReferralService from "../../service/referral.service";
import UserService from "../../service/user.service";
import WalletTransactionService from "../../service/wallet-transaction.service";

const loginRouter = Router()
const loginService = new LoginService(Admin)

const userService = new UserService(User, Booking)
const employeeService = new EmployeeService(Employee, EmployeeAbsenteeism, Salon, Feedback, ReportVendor, Booking)
const otpService = new OtpService(Otp, userService, employeeService)
const referralService = new  ReferralService(Referral)
const promoCodeService = new PromoCodeService(PromoCode)
const walletTransactionService = new WalletTransactionService(WalletTransaction, userService)
const loginController = new LoginController(loginService, CONFIG.ADMIN_JWT_KEY, '30 days', otpService,referralService,promoCodeService,walletTransactionService)

loginRouter.post("/create", loginController.create)
/**
 * @swagger
 * /api/login:
 *  post:
 *      tags: [Admin]
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
 *                              default: preet
 *                              required: true
 *                          password:
 *                              type: string
 *                              default: preet123
 *                              required: true
 *      responses:
 *          default:
 *              description: Admin Login Response
 */
loginRouter.post("/", loginController.loginAdmin)

export default loginRouter
