import { Router } from "express";
import SalonController from "../../controller/salon.controller";
import verifyToken from "../../middleware/jwt";
import Banner from "../../models/banner.model";
import Booking from '../../models/booking.model';
import Brand from "../../models/brands.model";
import Employee from "../../models/employees.model";
import Event from "../../models/event.model";
import FilterHome from "../../models/filterHome.model";
import Offer from "../../models/offer.model";
import PromoCode from "../../models/promo-code.model";
import PromoHomeCode from "../../models/promo-home.model";
import ReportSalon from "../../models/reportSalon.model";
import Review from '../../models/review.model';
import Salon from "../../models/salon.model";
import UserSearch from "../../models/user-search.model";
import User from "../../models/user.model";
import Vendor from "../../models/vendor.model";
import BannerService from "../../service/banner.service";
import PromoCodeService from "../../service/promo-code.service";
import PromoHomeService from "../../service/promo-home.service";
import SalonService from "../../service/salon.service";
import UserSearchService from "../../service/user-search.service";
import UserService from "../../service/user.service";
const salonRouter = Router()

const salonService = new SalonService(Salon, Employee, Vendor, Event, Offer, Review, Booking, Brand, FilterHome, ReportSalon)
const userSearchService = new UserSearchService(UserSearch)
const userService = new UserService(User, Booking)
const promoCodeService = new PromoCodeService(PromoCode)
const promoHomeService = new PromoHomeService(PromoHomeCode)
const bannerService = new BannerService(Banner)
const salonController = new SalonController(salonService, userSearchService,userService,promoCodeService,promoHomeService,bannerService)
salonRouter.get("/", verifyToken, salonController.get)
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
salonRouter.get("/:id/photo", verifyToken, salonController.getSalonPhoto)
salonRouter.get("/:id/offer", verifyToken, salonController.getOffer)
salonRouter.get("/:id/service", verifyToken, salonController.getService)
salonRouter.post("/:id/offer/:sid", verifyToken, salonController.createOffer)
salonRouter.get("/brands", verifyToken, salonController.getBrands)
salonRouter.post("/brand", verifyToken, salonController.addBrand)
salonRouter.put("/brand/:id", verifyToken, salonController.updateBrand)
salonRouter.delete("/brand/:id", verifyToken, salonController.deleteBrand)
salonRouter.get("/reviews/:id",verifyToken,salonController.getSalonReviews)
salonRouter.post("/unapproved/",verifyToken,salonController.getUnapprovedSalon)
salonRouter.get("/redis/:id",verifyToken,salonController.clearASalonRedisById)
salonRouter.get("/redis/salon-by-promo",verifyToken,salonController.clearRedisSalonByPromo)

export default salonRouter
