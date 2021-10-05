

import { Router } from "express"
import CashbackRangeController from "../../controller/cashback-range.controller"

import verifyToken from "../../middleware/jwt"
import Cashback from "../../models/cashbackRange.model"
import CashbackRangeService from "../../service/cashback-range.service"
const cashbackRangeRouter = Router()
const cashbackRangeService = new CashbackRangeService(Cashback)
const cashbackRangeController = new CashbackRangeController(cashbackRangeService)


cashbackRangeRouter.post("/add",verifyToken,cashbackRangeController.post)


export default cashbackRangeRouter