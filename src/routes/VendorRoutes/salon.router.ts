import { Router } from "express";
import SalonController from "../../controller/salon.controller";
import VendorverifyToken from "../../middleware/VendorJwt";
import Booking from '../../models/booking.model';
import Brand from "../../models/brands.model";
import Employee from "../../models/employees.model";
import Event from "../../models/event.model";
import Offer from "../../models/offer.model";
import PromoCode from "../../models/promo-code.model";
import ReportSalon from "../../models/reportSalon.model";
import Review from '../../models/review.model';
import Salon from "../../models/salon.model";
import UserSearch from "../../models/user-search.model";
import User from "../../models/user.model";
import Vendor from "../../models/vendor.model";
import PromoCodeService from "../../service/promo-code.service";
import SalonService from "../../service/salon.service";
import UserSearchService from "../../service/user-search.service";
import UserService from "../../service/user.service";

const salonRouter = Router()

const salonService = new SalonService(Salon,Employee,Vendor,Event,Offer,Review,Booking,Brand,ReportSalon)
const userSearchService = new UserSearchService(UserSearch)
const userService = new UserService(User,Booking)
const promoCodeService = new PromoCodeService(PromoCode)
const salonController = new SalonController(salonService, userSearchService,userService,promoCodeService)
//const ss = new SalonService()

salonRouter.post("/", VendorverifyToken, salonController.postSalon)
salonRouter.patch("/:id",VendorverifyToken,salonController.patchSalon)
salonRouter.get("/:id",VendorverifyToken,salonController.getId)
salonRouter.patch("/settings/:id",VendorverifyToken,salonController.salonSettings)
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
salonRouter.post("/:id/offer/:sid",VendorverifyToken,salonController.createOffer)



export default salonRouter