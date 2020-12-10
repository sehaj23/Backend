import { Router } from "express";
import PromoCodeController from "../../controller/promo-code.controller";
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
const salonService = new SalonService(Salon,Employee,Vendor,Event,Offer,Review,Booking,Brand,ReportSalon)
const promoUserService = new PromoUserService(PromoUserCode)
const promoCodeController = new PromoCodeController(promoCodeService, promoUserService, cartService, salonService)

//TODO: validate the data before sending it the to DB 
promoCodeRouter.post("/", promoCodeController.post)
promoCodeRouter.get("/", promoCodeController.get)
promoCodeRouter.post("/discountApplicable", promoCodeController.discountApplicable)

export default promoCodeRouter