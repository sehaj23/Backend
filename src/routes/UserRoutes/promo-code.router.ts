import { Router } from "express";
import PromoCodeController from "../../controller/promo-code.controller";
import UserverifyToken from "../../middleware/User.jwt";
import Booking from "../../models/booking.model";
import Brand from "../../models/brands.model";
import Cart from "../../models/cart.model";
import Employee from "../../models/employees.model";
import Event from "../../models/event.model";
import Offer from "../../models/offer.model";
import PromoCode from "../../models/promo-code.model";
import PromoUserCode from "../../models/promo-user.model";
import ReportSalon from "../../models/reportSalon.model";
import Review from "../../models/review.model";
import Salon from "../../models/salon.model";
import Vendor from "../../models/vendor.model";
import CartService from "../../service/cart.service";
import PromoCodeService from "../../service/promo-code.service";
import PromoUserService from "../../service/promo-user.service";
import SalonService from "../../service/salon.service";

const promoCodeRouter = Router()
const promoCodeService = new PromoCodeService(PromoCode)
const cartService = new CartService(Cart, Salon)
const salonService = new SalonService(Salon, Employee, Vendor, Event, Offer, Review, Booking, Brand, ReportSalon)
const promoUserService = new PromoUserService(PromoUserCode)
const promoCodeController = new PromoCodeController(promoCodeService, promoUserService, cartService, salonService)

//TODO: validate the data before sending it the to DB 

/**
 * @swagger
 * /api/u/promo-code/discountApplicable:
 *  post:
 *     tags: [User]
 *     description: Check for discount for the current user
 *     consumes:
 *         - application/json
 *     requestBody:
 *          description: Optional description in
 *          required: true
 *          content:
 *             application/json:
 *                 schema:
 *                     type: object
 *                     properties:
 *                         promo_code:
 *                             type: string
 *                             default: PREET15
 *                             required: true
 *                         cart_id:
 *                             type: string
 *                             required: false
 *     responses:
 *         default:
 *             description: User will get the discount applicable on the promo code.
 */
promoCodeRouter.post("/discountApplicable", UserverifyToken, promoCodeController.discountApplicable)
promoCodeRouter.post("/name", UserverifyToken, promoCodeController.getByName)
/**
 * @swagger
 * /api/u/promo-code:
 *  get:
 *     tags: [User]
 *     description: Get promo code applicable to user on his current cart.
 *     responses:
 *         default:
 *             description: User will get the promo codes.
 */
promoCodeRouter.get("/", UserverifyToken, promoCodeController.promoCodeByUserId)
promoCodeRouter.get("/salon/:id",promoCodeController.getPromoBySalon)


export default promoCodeRouter