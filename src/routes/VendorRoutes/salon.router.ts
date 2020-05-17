import { Router } from "express";
import VendorverifyToken, { vendorJWTVerification } from "../../middleware/VendorJwt";
import SalonService from "../../service/VendorService/salon.service";

const salonRouter = Router()
const ss = new SalonService()

salonRouter.post("/", VendorverifyToken, ss.post)
salonRouter.patch("/:id",VendorverifyToken,ss.patchSalon)
salonRouter.put("/settings/:id",VendorverifyToken,ss.salonSettings)
salonRouter.put("/:id/service", VendorverifyToken, ss.addSalonService)
salonRouter.put("/:id/service/delete/:sid", VendorverifyToken, ss.deleteSalonService)
salonRouter.get("/:id/service", VendorverifyToken, ss.getService)




export default salonRouter