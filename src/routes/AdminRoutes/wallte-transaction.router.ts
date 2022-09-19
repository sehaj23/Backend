
import { Router } from "express";
import WalletTransactionController from "../../controller/wallet-transaction.controller";
import verifyToken from "../../middleware/jwt";
import Booking from "../../models/booking.model";
import User from "../../models/user.model";
import WalletTransaction from "../../models/wallet-transaction.model";
import WalletRazorpay from "../../models/walletRazorpay.model";
import UserService from "../../service/user.service";
import WalletTransactionService from "../../service/wallet-transaction.service";
import WalletRazorpayService from "../../service/walletRazorpay.service";

const walletTransactionRouter = Router()
const walletRazorpayService = new WalletRazorpayService(WalletRazorpay)
const userService = new UserService(User, Booking)
const walletTransactionService: WalletTransactionService = new WalletTransactionService(WalletTransaction, userService)
const walletRazorpayController = new WalletTransactionController(walletTransactionService)
walletTransactionRouter.post("/add",walletRazorpayController.addMoneyInWallet)
walletTransactionRouter.get("/", verifyToken, walletRazorpayController.getWithPagination)

export default walletTransactionRouter
