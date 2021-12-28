import Banner from "../../models/banner.model"

import { Router } from "express"
import BannerController from "../../controller/banner.controller"
import BannerService from "../../service/banner.service"
import verifyToken from "../../middleware/jwt"


const bannerRouter = Router()
const bannerService = new BannerService(Banner)
const bannerController = new BannerController(bannerService)



bannerRouter.get("/active",verifyToken,bannerController.getActiveBanners)
bannerRouter.post("/create",verifyToken,bannerController.post)
bannerRouter.get("/",verifyToken,bannerController.get)
bannerRouter.put("/:id",verifyToken,bannerController.put)
bannerRouter.delete("/:id",verifyToken,bannerController.delete)
bannerRouter.get("/redis",verifyToken,bannerController.clearRedisBanner)


export default bannerRouter