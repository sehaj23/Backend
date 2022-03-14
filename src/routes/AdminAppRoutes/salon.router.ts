import { Router } from "express";
import SalonController from "../../controller/salon.controller";
import verifyToken from "../../middleware/jwt";
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

const salonService = new SalonService(Salon, Employee, Vendor, Event, Offer, Review, Booking, Brand, ReportSalon)
const userSearchService = new UserSearchService(UserSearch)
const userService = new UserService(User, Booking)
const promoCodeService = new PromoCodeService(PromoCode)
const salonController = new SalonController(salonService, userSearchService,userService,promoCodeService)

/**
 * @swagger
 * /api/salon/names:
 *  get:
 *      summary: Get the list of names and _ids of salon
 *      tags: [Admin]
 *      description: To get the names and _id of all the salons
 *      responses:
 *          default:
 *              description: Salon names and _ids
 */
salonRouter.get("/names", verifyToken, salonController.getNameIDRatingProfile)
salonRouter.get("/info/:id",verifyToken,salonController.getId)
salonRouter.put("/update/:id",verifyToken,salonController.put)
salonRouter.get("/unapproved/",verifyToken,salonController.getUnapprovedSalon)
salonRouter.put("/:id/add/photo", verifyToken, salonController.putPhoto)
salonRouter.delete("/:id/remove/photo/:photoID", verifyToken, salonController.removePhoto)
salonRouter.get("/", verifyToken, salonController.get)


export default salonRouter
