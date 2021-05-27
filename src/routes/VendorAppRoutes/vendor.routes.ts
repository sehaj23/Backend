import { Router } from "express";
import VendorverifyToken from "../../middleware/VendorJwt"
import VendorService from "../../service/vendor.service";
import verifyToken from "../../middleware/jwt";
import Vendor from "../../models/vendor.model";
import EmployeeAbsenteeism from "../../models/employeeAbsenteeism.model";
import VendorController from "../../controller/vendor.controller";
import LoginService from "../../service/login.service";
import LoginController from "../../controller/login.controller";
import ReportVendor from "../../models/reportVendor.model"
import CONFIG from "../../config";
import Feedback from "../../models/feedback.model"
import Employee from "../../models/employees.model";
import Salon from "../../models/salon.model";
import EmployeeService from "../../service/employee.service";
import Booking from "../../models/booking.model";
import Otp from "../../models/otp.model";
import User from "../../models/user.model";
import OtpService from "../../service/otp.service";
import UserService from "../../service/user.service";
import Referral from "../../models/referral.model";
import ReferralService from "../../service/referral.service";
import EmployeeAbsenteesmService from "../../service/employee-absentism.service";
import PromoCodeService from "../../service/promo-code.service";
import PromoCode from "../../models/promo-code.model";
const vendorRouter = Router()

const vs = new VendorService(Vendor,EmployeeAbsenteeism,ReportVendor,Feedback)
const es = new  EmployeeService(Employee,EmployeeAbsenteeism,Salon,Feedback,ReportVendor, Booking)
const eas = new EmployeeAbsenteesmService(EmployeeAbsenteeism)
const vendorController = new VendorController(vs,es,eas)

const loginService = new LoginService(Vendor)

const userService = new UserService(User, Booking)
const otpService = new OtpService(Otp, userService, es)
const referralService = new  ReferralService(Referral)
const promoCodeService =  new PromoCodeService(PromoCode)
const loginController = new LoginController(loginService, CONFIG.VENDOR_JWT, '30 days', otpService,referralService,promoCodeService)

vendorRouter.post("/",loginController.login);
vendorRouter.post("/create", loginController.create)
vendorRouter.post("/absent",VendorverifyToken,vendorController.employeeAbsent)
vendorRouter.post("/absent/update",VendorverifyToken,vendorController.employeeAbsent)
vendorRouter.get("/info",VendorverifyToken ,vendorController.vendorInfo)
vendorRouter.put("/", VendorverifyToken, vendorController.update)
vendorRouter.put("/fcm", VendorverifyToken, vendorController.updateFCM)
vendorRouter.patch("/fcm", VendorverifyToken, vendorController.deleteFcm)
vendorRouter.patch("/update/",VendorverifyToken,vendorController.updatePass)
vendorRouter.get("/employee-slots/:id",VendorverifyToken, vendorController.employeeSlots)
vendorRouter.get("/slots/:id",VendorverifyToken,vendorController.slots)
vendorRouter.get("/employee/:id",VendorverifyToken,vendorController.employeebyId)
vendorRouter.post("/report",VendorverifyToken,vendorController.report)
vendorRouter.post("/feedback",VendorverifyToken,vendorController.feedback)
vendorRouter.patch("/delete",VendorverifyToken,vendorController.vendorDelete)
vendorRouter.get("/service/:id",VendorverifyToken,vendorController.vendorService)
vendorRouter.get("/service/employee/:id",VendorverifyToken,vendorController.employeeServicecount)
vendorRouter.patch("/notification",VendorverifyToken,vendorController.notificationUpdate)
vendorRouter.get("/version",vendorController.appVersion)
vendorRouter.get("/employee-absent",vendorController.checkIfEmployeeAbsent)



vendorRouter.put("/profile-pic", VendorverifyToken, vendorController.putProfilePic)


export default vendorRouter