import { Router } from "express";
import RefundController from "../../controller/refund.controller";
import UserverifyToken from "../../middleware/User.jwt";
import Booking from "../../models/booking.model";
import Cart from "../../models/cart.model";
import Explore from "../../models/explore.model";
import MongoCounter from "../../models/mongo-counter.model";
import Referral from "../../models/referral.model";
import Refund from "../../models/refund.model";
import Salon from "../../models/salon.model";
import User from "../../models/user.model";
import WalletTransaction from "../../models/wallet-transaction.model";
import BookingService from "../../service/booking.service";
import CartService from "../../service/cart.service";
import MongoCounterService from "../../service/mongo-counter.service";
import RefundService from "../../service/refund.service";
import UserService from "../../service/user.service";
import WalletTransactionService from "../../service/wallet-transaction.service";
import { RefundValidator } from "../../validators/refund.validator";


const refundRouter = Router()
const cartService = new CartService(Cart, Salon,Explore)
const mongoCounterService = new MongoCounterService(MongoCounter)
const userService = new UserService(User, Booking)
const walletTransactionService: WalletTransactionService = new WalletTransactionService(WalletTransaction, userService)
const bookingService = new BookingService(Booking, Salon, cartService, mongoCounterService, Referral, walletTransactionService)
const refundService = new RefundService(Refund, bookingService, walletTransactionService)
const refundController = new RefundController(refundService)

refundRouter.post("/", [...RefundValidator.post, UserverifyToken], refundController.post)

export default refundRouter