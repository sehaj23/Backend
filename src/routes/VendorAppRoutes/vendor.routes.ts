import { Router } from "express";
import VendorverifyToken from "../../middleware/VendorJwt"
import VendorService from "../../service/vendor.service";
import verifyToken from "../../middleware/jwt";
import Vendor from "../../models/vendor.model";
import EmployeeAbsenteeism from "../../models/employeeAbsenteeism.model";
import VendorController from "../../controller/vendor.controller";
import LoginService from "../../service/login.service";
import LoginController from "../../controller/login.controller";
import CONFIG from "../../config";
const vendorRouter = Router()

const vs = new VendorService(Vendor,EmployeeAbsenteeism)
const vendorController = new VendorController(vs)
const loginService = new LoginService(Vendor)
const loginController = new LoginController(loginService, CONFIG.VENDOR_JWT, '7 days')

vendorRouter.post("/",loginController.login);
vendorRouter.post("/absent",VendorverifyToken,vendorController.employeeAbsent)
vendorRouter.post("/absent/update",VendorverifyToken,vendorController.employeeAbsent)
vendorRouter.get("/",VendorverifyToken ,vendorController.vendorInfo)
vendorRouter.put("/", VendorverifyToken, vendorController.update)
vendorRouter.patch("/update/",VendorverifyToken,vendorController.updatePass)
vendorRouter.get("/employee-slots/:id",VendorverifyToken, vendorController.employeeSlots)
vendorRouter.get("/slots/:id",VendorverifyToken,vendorController.slots)
vendorRouter.get("/employee/:id",VendorverifyToken,vendorController.employeebyId)

vendorRouter.put("/profile-pic", VendorverifyToken, vendorController.putProfilePic)

export default vendorRouter