import { Router } from "express";
import verifyToken from "../../middleware/jwt";
import SalonService from "../../service/salon.service";
import Salon from "../../models/salon.model";
import SalonController from "../../controller/salon.controller";
import Employee from "../../models/employees.model";
import Vendor from "../../models/vendor.model";
import Event from "../../models/event.model"
import Offer from "../../models/offer.model";
import Review from '../../models/review.model'
import Booking from '../../models/booking.model'
const salonRouter = Router()

const salonService = new SalonService(Salon,Employee,Vendor,Event,Offer,Review,Booking)
const salonController = new SalonController(salonService)
salonRouter.get("/", verifyToken, salonController.get)
salonRouter.get("/:id", verifyToken, salonController.getId)
salonRouter.post("/", verifyToken, salonController.postSalon)
salonRouter.put("/:id", verifyToken, salonController.put)
salonRouter.post("/event", verifyToken, salonController.addSalonEvent)
salonRouter.put("/:id/service", verifyToken, salonController.addSalonService)
salonRouter.get("/:id/service", verifyToken, salonController.getService)
salonRouter.put("/:id/service/delete/:sid", verifyToken, salonController.deleteSalonService)
salonRouter.put("/:id/employee", verifyToken, salonController.addSalonEmployee)
salonRouter.put("/:id/employee/delete/:eid", verifyToken, salonController.deleteSalonEmployee)
salonRouter.put("/:id/photo", verifyToken, salonController.putPhoto)
salonRouter.get("/:id/photo", verifyToken, salonController.getPhoto)
salonRouter.get("/:id/offer", verifyToken, salonController.getOffer)
salonRouter.get("/:id/service", verifyToken, salonController.getService)
salonRouter.post("/:id/offer/:sid",verifyToken,salonController.createOffer)

// designerRouter.get("/event/get", verifyToken, DesignerService.getDesignerEvent)

export default salonRouter
