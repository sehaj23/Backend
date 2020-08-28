import VendorController from "../../controller/vendor.controller";
import VendorService from "../../service/vendor.service";
import Vendor from "../../models/vendor.model";
import EmployeeAbsenteeism from "../../models/employeeAbsenteeism.model";
import { Router } from "express";
import VendorverifyToken from "../../middleware/VendorJwt";
import ReportVendor from "../../models/reportVendor.model";


const vendorService = new VendorService(Vendor, EmployeeAbsenteeism,ReportVendor)
const vendorController = new VendorController(vendorService)

const vendorRouter = Router()

vendorRouter.get("/", VendorverifyToken, vendorController.vendorInfo)

export default vendorRouter