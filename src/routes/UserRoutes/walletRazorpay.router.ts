import { Router } from "express";
import WalletRazorpayController from "../../controller/walletRazorpay.controller";
import UserverifyToken from "../../middleware/User.jwt";
import Booking from "../../models/booking.model";
import User from "../../models/user.model";
import WalletTransaction from "../../models/wallet-transaction.model";
import WalletRazorpay from "../../models/walletRazorpay.model";
import UserService from "../../service/user.service";
import WalletTransactionService from "../../service/wallet-transaction.service";
import WalletRazorpayService from "../../service/walletRazorpay.service";
import { WalletRazorpayValidator } from "../../validators/walletRazorpay.validator";

const walletRazorpayRouter = Router()
const walletRazorpayService = new WalletRazorpayService(WalletRazorpay)
const userService = new UserService(User, Booking)
const walletTransactionService: WalletTransactionService = new WalletTransactionService(WalletTransaction, userService)
const walletRazorpayController = new WalletRazorpayController(walletRazorpayService, walletTransactionService)
walletRazorpayRouter.post("/", [...WalletRazorpayValidator.post, UserverifyToken], walletRazorpayController.post)
walletRazorpayRouter.patch("/:walletRazorpayId", [...WalletRazorpayValidator.transactionResponse, UserverifyToken], walletRazorpayController.transactionResponse)

export default walletRazorpayRouter
