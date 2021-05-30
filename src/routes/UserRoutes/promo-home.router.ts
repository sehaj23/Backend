

import { Router } from "express"
import PromoHomeController from "../../controller/promo-home.controller"
import PromoHomeCode from "../../models/promo-home.model"
import PromoHomeService from "../../service/promo-home.service"


const promoHomeRouter = Router()
const promoHomeService = new PromoHomeService(PromoHomeCode)
const promoHomeController = new PromoHomeController(promoHomeService)



promoHomeRouter.get("/active",promoHomeController.getActivePromo)


export default promoHomeRouter