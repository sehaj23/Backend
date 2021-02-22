import { Router } from "express";
import WalletRazorpayController from "../../controller/walletRazorpay.controller";
import UserverifyToken from "../../middleware/User.jwt";
import WalletRazorpay from "../../models/walletRazorpay.model";
import WalletRazorpayService from "../../service/walletRazorpay.service";
import { WalletRazorpayValidator } from "../../validators/walletRazorpay.validator";

const walletRazorpayRouter = Router()
const walletRazorpayService = new WalletRazorpayService(WalletRazorpay)
const walletRazorpayController = new WalletRazorpayController(walletRazorpayService)
walletRazorpayRouter.post("/", [...WalletRazorpayValidator.post, UserverifyToken], walletRazorpayController.post)
walletRazorpayRouter.patch("/", [...WalletRazorpayValidator.transactionResponse, UserverifyToken], walletRazorpayController.transactionResponse)

export default walletRazorpayRouter
