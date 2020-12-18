import { Router } from "express";
import SalonController from "../../controller/salon.controller";
import verifyToken from "../../middleware/jwt";
import Booking from '../../models/booking.model';
import Brand from "../../models/brands.model";
import Employee from "../../models/employees.model";
import Event from "../../models/event.model";
import Offer from "../../models/offer.model";
import ReportSalon from "../../models/reportSalon.model";
import Review from '../../models/review.model';
import Salon from "../../models/salon.model";
import UserSearch from "../../models/user-search.model";
import Vendor from "../../models/vendor.model";
import SalonService from "../../service/salon.service";
import UserSearchService from "../../service/user-search.service";
const salonRouter = Router()

const salonService = new SalonService(Salon,Employee,Vendor,Event,Offer,Review,Booking,Brand,ReportSalon)
const userSearchService = new UserSearchService(UserSearch)
const salonController = new SalonController(salonService, userSearchService)
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
salonRouter.post("/brand",verifyToken,salonController.addBrand)

// designerRouter.get("/event/get", verifyToken, DesignerService.getDesignerEvent)

export default salonRouter
