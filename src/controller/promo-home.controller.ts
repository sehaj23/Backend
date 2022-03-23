import PromoHomeService from "../service/promo-home.service"
import { Request, Response } from 'express';
import BaseController from "./base.controller";
import controllerErrorHandler from "../middleware/controller-error-handler.middleware";
import { PromoCodeRedis } from "../redis/index.redis";
import REDIS_CONFIG from "../utils/redis-keys";
import BannerService from "../service/banner.service";

export default class PromoHomeController extends BaseController {
    service:PromoHomeService
    bannerService:BannerService
    constructor(service:PromoHomeService,bannerService:BannerService){
    super(service)
        this.service=service
        this.bannerService=bannerService
}

getActivePromo = controllerErrorHandler(async (req: Request, res: Response) => {
    let out
    const promo = await PromoCodeRedis.get(REDIS_CONFIG.promoHomeRedis)
    if(promo == null){
         out = await this.service.get({active:true})
        PromoCodeRedis.set(REDIS_CONFIG.promoHomeRedis,out)
}else{
    out = JSON.parse(promo)
}
        res.status(200).send(out)
})

getHomePageBannerAndPromo = controllerErrorHandler(async (req: Request, res: Response) => {
    let out
    const data = await PromoCodeRedis.get(REDIS_CONFIG.promoHomeRedis)
    
    if(data == null){
        const promoReq =  this.service.get({active:true})
        const bannerReq =   this.bannerService.getActiveBanners()
        const [promo,banner]= await Promise.all([promoReq,bannerReq])
        out ={promo,banner}
       await PromoCodeRedis.set(REDIS_CONFIG.promoHomeRedis,{promo,banner})
}else{
    out = JSON.parse(data)
}
        res.status(200).send(out)
})

clearActivePromo=controllerErrorHandler(async (req: Request, res: Response) => {
    PromoCodeRedis.remove(REDIS_CONFIG.promoHomeRedis)
    res.status(200).send({ msg: 'Redis store PromoHome cleared' })
    
})
}