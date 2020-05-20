import { Router } from "express";
import VendorverifyToken, { vendorJWTVerification } from "../../middleware/VendorJwt";
import SalonService from "../../service/VendorService/salon.service";

const salonRouter = Router()
const ss = new SalonService()

salonRouter.post("/", VendorverifyToken, ss.post)
salonRouter.patch("/:id",VendorverifyToken,ss.patchSalon)
salonRouter.get("/:id",VendorverifyToken,ss.getId)
salonRouter.put("/settings/:id",VendorverifyToken,ss.salonSettings)
salonRouter.put("/:id/service", VendorverifyToken, ss.addSalonService)
salonRouter.delete("/:id/service/delete/:sid", VendorverifyToken, ss.deleteSalonService)
salonRouter.get("/:id/service", VendorverifyToken, ss.getService)
salonRouter.patch("/:id/service/update/:sid",ss.updateService)
salonRouter.put("/:id/employee", VendorverifyToken, ss.addSalonEmployee)
salonRouter.put("/:id/employee/delete/:eid", VendorverifyToken, ss.deleteSalonEmployee)




export default salonRouter