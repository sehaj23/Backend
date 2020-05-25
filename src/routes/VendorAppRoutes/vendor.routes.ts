import { Router } from "express";
import VendorverifyToken from "../../middleware/VendorJwt"
import VendorService from "../../service/VendorAppService/vendor.service";
const vendorRouter = Router()
const vs = new VendorService()

vendorRouter.post("/",vs.vendorLogin);

export default vendorRouter
