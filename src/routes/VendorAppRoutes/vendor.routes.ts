import { Router } from "express";
import VendorverifyToken from "../../middleware/VendorJwt"
import VendorService from "../../service/VendorAppService/vendor.service";
import verifyToken from "../../middleware/jwt";
const vendorRouter = Router()
const vs = new VendorService()

vendorRouter.post("/",vs.vendorLogin);
vendorRouter.post("/absent",VendorverifyToken,vs.employeeAbsent)
vendorRouter.post("/absent/update",VendorverifyToken,vs.employeeAbsent)
vendorRouter.get("/",VendorverifyToken ,vs.get)
vendorRouter.put("/:id", VendorverifyToken, vs.put)
vendorRouter.put("/:id/profile-pic", VendorverifyToken, vs.putProfilePic)

export default vendorRouter