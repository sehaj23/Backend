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
salonRouter.delete("/:id/employee/delete/:eid", VendorverifyToken, ss.deleteSalonEmployee)
salonRouter.patch("/:id/employee/update/:eid",VendorverifyToken,ss.editSalonEmployee)
salonRouter.put("/:id/photo", VendorverifyToken, ss.putPhoto)
salonRouter.get("/:id/photo", VendorverifyToken, ss.getPhoto)
salonRouter.put("/:id/profile-pic", VendorverifyToken, ss.putProfilePic)




export default salonRouter