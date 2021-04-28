

import { Router } from "express"
import PromoHomeController from "../../controller/promo-home.controller"
import verifyToken from "../../middleware/jwt"
import PromoHomeCode from "../../models/promo-home.model"
import PromoHomeService from "../../service/promo-home.service"


const promoHomeRouter = Router()
const promoHomeService = new PromoHomeService(PromoHomeCode)
const promoHomeController = new PromoHomeController(promoHomeService)



promoHomeRouter.get("/active",verifyToken,promoHomeController.getActivePromo)
promoHomeRouter.post("/create",verifyToken,promoHomeController.post)
promoHomeRouter.get("/redis",verifyToken,promoHomeController.clearActivePromo)

export default promoHomeRouter