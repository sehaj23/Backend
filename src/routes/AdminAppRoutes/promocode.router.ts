import { Router } from "express";
import { body } from "express-validator";
import PromoCodeController from "../../controller/promo-code.controller";
import verifyToken from "../../middleware/jwt";
import mySchemaValidator from "../../middleware/my-schema-validator";
import Booking from "../../models/booking.model";
import Brand from "../../models/brands.model";
import Cart from "../../models/cart.model";
import Employee from "../../models/employees.model";
import Event from "../../models/event.model";
import Explore from "../../models/explore.model";
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
const cartService = new CartService(Cart, Salon,Explore)
const salonService = new SalonService(Salon, Employee, Vendor, Event, Offer, Review, Booking, Brand, ReportSalon)
const promoUserService = new PromoUserService(PromoUserCode)
const promoCodeController = new PromoCodeController(promoCodeService, promoUserService, cartService, salonService)

//TODO: validate the data before sending it the to DB 
const postPromoCodeValidator = [
    body('promo_code').isString().withMessage('Enter service name in query'),
    mySchemaValidator
]
/**
 * @swagger
 * /api/promo-code:
 *  post:
 *      tags: [Admin]
 *      consumes:
 *          - application/json
 *      requestBody:
 *          description: Optional description in
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          promo_code:
 *                              type: string
 *                              default: ZAT800
 *                              required: true
 *                          description:
 *                              type: string
 *                              default: This is a promo code whioch gives you a discount of 800
 *                              required: true
 *                          salon_ids:
 *                              type: array
 *                              items:
 *                                  type: string
 *                              default: [507f1f77bcf86cd799439011]
 *                          categories:
 *                              type: array
 *                              items:
 *                                  type: string
 *                              default: ['HAIRCOLOR']
 *                          user_ids:
 *                              type: array
 *                              items:
 *                                  type: string
 *                              default: [507f1f77bcf86cd799439011]
 *                          start_date_time:
 *                              type: date
 *                              description: YYYY/MM/DD
 *                              default: 2021-01-29
 *                          expiry_date_time:
 *                              type: date
 *                              description: YYYY/MM/DD
 *                              default: 2021-01-30
 *                          time_type:
 *                              type: string
 *                              enum: ['All Day', 'Custom']   
 *                              required: true
 *                          custom_time_days:
 *                              type: array
 *                              items:
 *                                  type: integer
 *                              default: [0, 3]
 *                          custom_time_start_time:
 *                              type: string
 *                              default: "03:00 pm"
 *                          custom_time_end_time:
 *                              type: string
 *                              default: "03:00 pm"
 *                          minimum_bill:
 *                              type: integer
 *                              default: 1
 *                              required: true
 *                          discount_type:
 *                              type: string
 *                              enum: ['Flat Price', 'Discount Percentage']
 *                          flat_price:
 *                              type: integer
 *                              default: 1
 *                          discount_percentage:
 *                              type: integer
 *                              default: 1
 *                          discount_cap:
 *                              type: integer
 *                              default: 1
 *                              required: true
 *                          payment_mode:
 *                              type: string
 *                              enum: ['COD', 'Online', 'Both']
 *                              required: true
 *                          max_usage:
 *                              type: integer
 *                              default: 1
 *                          usage_time_difference:
 *                              type: integer
 *                              default: 1
 * 
 *      
 *      responses:
 *          default:
 *              description: Promo code create response
 */
promoCodeRouter.post("/", verifyToken, promoCodeController.post)
promoCodeRouter.get("/", verifyToken, promoCodeController.get)
promoCodeRouter.get("/names", verifyToken, promoCodeController.getNames)
promoCodeRouter.put("/:id", verifyToken, promoCodeController.put)
promoCodeRouter.delete("/:id",verifyToken,promoCodeController.delete)
promoCodeRouter.get("/salon/:id",verifyToken,promoCodeController.getPromoBySalon)
promoCodeRouter.post("/discountApplicable", verifyToken, promoCodeController.discountApplicable)

export default promoCodeRouter