

import { Router } from "express"
import PromoUserController from "../../controller/promo-user.controller"
import verifyToken from "../../middleware/jwt"
import PromoUserCode from "../../models/promo-user.model"

import PromoUserService from "../../service/promo-user.service"



const promoUserRouter = Router()
const promoUserService = new PromoUserService(PromoUserCode)
const promoUserController  =new PromoUserController(promoUserService)

promoUserRouter.post("/create",verifyToken,promoUserController.post)




export default promoUserRouter