import Banner from "../../models/banner.model"

import { Router } from "express"
import BannerController from "../../controller/banner.controller"
import BannerService from "../../service/banner.service"


const bannerRouter = Router()
const bannerService = new BannerService(Banner)
const bannerController = new BannerController(bannerService)



bannerRouter.get("/active",bannerController.getActiveBanners)


export default bannerRouter