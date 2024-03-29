import { Router } from "express";

import VendorverifyToken from "../../middleware/VendorJwt";
import VendorService from "../../service/vendor.service";
import CONFIG from '../../config'
import Vendor from '../../models/vendor.model'
import LoginController from '../../controller/login.controller'
import LoginService from '../../service/login.service'
import Feedback from "../../models/feedback.model";
import Booking from "../../models/booking.model";
import EmployeeAbsenteeism from "../../models/employeeAbsenteeism.model";
import Employee from "../../models/employees.model";
import Otp from "../../models/otp.model";
import ReportVendor from "../../models/reportVendor.model";
import Salon from "../../models/salon.model";
import User from "../../models/user.model";
import EmployeeService from "../../service/employee.service";
import OtpService from "../../service/otp.service";
import UserService from "../../service/user.service";
import ReferralService from "../../service/referral.service";
import Referral from "../../models/referral.model";
import PromoCodeService from "../../service/promo-code.service";
import PromoCode from "../../models/promo-code.model";
import WalletTransactionService from "../../service/wallet-transaction.service";
import WalletTransaction from "../../models/wallet-transaction.model";

// const ls = new  LoginService()


const loginRouter = Router()
const loginService = new LoginService(Vendor)

const userService = new UserService(User, Booking)
const employeeService = new EmployeeService(Employee, EmployeeAbsenteeism, Salon, Feedback, ReportVendor, Booking)
const otpService = new OtpService(Otp, userService, employeeService)
const referralService = new  ReferralService(Referral)
const promoCodeService = new PromoCodeService(PromoCode)
const walletTransactionService = new WalletTransactionService(WalletTransaction, userService)
const loginController = new LoginController(loginService, CONFIG.VENDOR_JWT, '7 days', otpService,referralService,promoCodeService,walletTransactionService)

loginRouter.post("/", loginController.loginVendor)
loginRouter.post("/create", loginController.create)

// loginRouter.post("/", ls.vendorPost)
// loginRouter.post("/create", ls.createVendor)


// loginRouter.get("/vendor",VendorverifyToken,ls.get)
// loginRouter.put("/:id/profile-pic", VendorverifyToken, ls.putProfilePic)

export default loginRouter
