import { Router } from "express";
import VendorverifyToken, { vendorJWTVerification } from "../../middleware/VendorJwt";
import SalonService from "../../service/VendorService/salon.service";

const salonRouter = Router()
const ss = new SalonService()

salonRouter.post("/", VendorverifyToken, ss.post)
salonRouter.patch("/:id",VendorverifyToken,ss.patchSalon)
salonRouter.put("/settings/:id",VendorverifyToken,ss.salonSettings)




export default salonRouter