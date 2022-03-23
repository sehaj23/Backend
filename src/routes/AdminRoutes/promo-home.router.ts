

import { Router } from "express"
import PromoHomeController from "../../controller/promo-home.controller"
import verifyToken from "../../middleware/jwt"
import Banner from "../../models/banner.model"
import PromoHomeCode from "../../models/promo-home.model"
import BannerService from "../../service/banner.service"
import PromoHomeService from "../../service/promo-home.service"


const promoHomeRouter = Router()
const promoHomeService = new PromoHomeService(PromoHomeCode)
const bannerService = new BannerService(Banner)
const promoHomeController = new PromoHomeController(promoHomeService,bannerService)



promoHomeRouter.get("/active",verifyToken,promoHomeController.getActivePromo)
promoHomeRouter.post("/create",verifyToken,promoHomeController.post)
promoHomeRouter.get("/",verifyToken,promoHomeController.get)
promoHomeRouter.put("/:id",verifyToken,promoHomeController.put)
promoHomeRouter.delete("/:id",verifyToken,promoHomeController.delete)
promoHomeRouter.get("/redis",verifyToken,promoHomeController.clearActivePromo)

export default promoHomeRouter