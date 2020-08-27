import { Router } from "express";
import verifyToken from "../../middleware/jwt";
import VendorService from "../../service/vendor.service";
import VendorController from "../../controller/vendor.controller"
import Vendor from "../../models/vendor.model";
import EmployeeAbsenteeism from "../../models/employeeAbsenteeism.model";
import ReportVendor from "../../models/reportVendor.model";

const vendorRouter = Router()
const vs = new VendorService(Vendor,EmployeeAbsenteeism,ReportVendor)
const vendorController = new VendorController(vs)

vendorRouter.post("/", verifyToken, vendorController.post)
vendorRouter.get("/", verifyToken, vendorController.get)
vendorRouter.get("/:id", verifyToken, vendorController.getId)
vendorRouter.put("/:id", verifyToken, vendorController.put)

export default vendorRouter
