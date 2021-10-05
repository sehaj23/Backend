import { Router } from "express"
import CashbackController from "../../controller/cashback.controller"
import UserverifyToken from "../../middleware/User.jwt"
import Booking from "../../models/booking.model"
import Cashbackuser from "../../models/cashback.model"
import User from "../../models/user.model"
import WalletTransaction from "../../models/wallet-transaction.model"
import CashbackService from "../../service/cashback.service"
import UserService from "../../service/user.service"
import WalletTransactionService from "../../service/wallet-transaction.service"

const cashbackRouter = Router()
const cashbackService = new CashbackService(Cashbackuser)
const userService = new UserService(User, Booking)
const walletTransactionService: WalletTransactionService = new WalletTransactionService(WalletTransaction, userService)
const cashbackController = new CashbackController(cashbackService,walletTransactionService)


cashbackRouter.get("/avail/:id",UserverifyToken,cashbackController.availCashback)
cashbackRouter.get("/user",UserverifyToken,cashbackController.getCashbackUserList)
export default cashbackRouter
