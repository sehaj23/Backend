

import { Router } from "express"
import PromoHomeController from "../../controller/promo-home.controller"
import Banner from "../../models/banner.model"
import PromoHomeCode from "../../models/promo-home.model"
import BannerService from "../../service/banner.service"
import PromoHomeService from "../../service/promo-home.service"


const promoHomeRouter = Router()
const promoHomeService = new PromoHomeService(PromoHomeCode)
const bannerService = new BannerService(Banner)
const promoHomeController = new PromoHomeController(promoHomeService,bannerService)



promoHomeRouter.get("/active",promoHomeController.getActivePromo)
promoHomeRouter.get("/home-page",promoHomeController.getHomePageBannerAndPromo)


export default promoHomeRouter