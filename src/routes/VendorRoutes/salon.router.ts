import { Router } from "express";
import VendorverifyToken, { vendorJWTVerification } from "../../middleware/VendorJwt";
import SalonService from "../../service/salon.service";
import Salon from "../../models/salon.model";
import SalonController from "../../controller/salon.controller";

const salonRouter = Router()

const salonService = new SalonService(Salon)
const salonController = new SalonController(salonService)
//const ss = new SalonService()

salonRouter.post("/", VendorverifyToken, salonController.postSalon)
salonRouter.patch("/:id",VendorverifyToken,salonController.patchSalon)
salonRouter.get("/:id",VendorverifyToken,salonController.getId)
salonRouter.put("/settings/:id",VendorverifyToken,salonController.salonSettings)
salonRouter.put("/:id/service", VendorverifyToken, salonController.addSalonService)
salonRouter.delete("/:id/service/delete/:sid", VendorverifyToken, salonController.deleteSalonService)
salonRouter.get("/:id/service", VendorverifyToken, salonController.getService)
salonRouter.patch("/:id/service/update/:sid",salonController.updateService)
salonRouter.put("/:id/employee", VendorverifyToken, salonController.addSalonEmployee)
salonRouter.delete("/:id/employee/delete/:eid", VendorverifyToken, salonController.deleteSalonEmployee)
salonRouter.patch("/:id/employee/update/:eid",VendorverifyToken,salonController.editSalonEmployee)
salonRouter.put("/:id/photo", VendorverifyToken, salonController.putPhoto)
salonRouter.get("/:id/photo", VendorverifyToken, salonController.getPhoto)
salonRouter.put("/:id/profile-pic", VendorverifyToken, salonController.putProfilePic)




export default salonRouter