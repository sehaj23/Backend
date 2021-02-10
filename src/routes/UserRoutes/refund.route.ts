import { Router } from "express";
import RefundController from "../../controller/refund.controller";
import UserverifyToken from "../../middleware/User.jwt";
import Booking from "../../models/booking.model";
import Cart from "../../models/cart.model";
import MongoCounter from "../../models/mongo-counter.model";
import Referral from "../../models/referral.model";
import Refund from "../../models/refund.model";
import Salon from "../../models/salon.model";
import BookingService from "../../service/booking.service";
import CartService from "../../service/cart.service";
import MongoCounterService from "../../service/mongo-counter.service";
import RefundService from "../../service/refund.service";
import { RefundValidator } from "../../validators/refund.validator";

const refundRouter = Router()
const cartService = new CartService(Cart, Salon)
const mongoCounterService = new MongoCounterService(MongoCounter)
const bookingService = new BookingService(Booking, Salon, cartService, mongoCounterService, Referral)
const refundService = new RefundService(Refund, bookingService)
const refundController = new RefundController(refundService)

refundRouter.post("/", [...RefundValidator.post, UserverifyToken], refundController.post)

export default refundRouter