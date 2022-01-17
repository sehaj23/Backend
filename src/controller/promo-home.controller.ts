import PromoHomeService from "../service/promo-home.service"
import { Request, Response } from 'express';
import BaseController from "./base.controller";
import controllerErrorHandler from "../middleware/controller-error-handler.middleware";
import { PromoCodeRedis } from "../redis/index.redis";
import REDIS_CONFIG from "../utils/redis-keys";

export default class PromoHomeController extends BaseController {
    service:PromoHomeService
    constructor(service:PromoHomeService){
    super(service)
        this.service=service
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

clearActivePromo=controllerErrorHandler(async (req: Request, res: Response) => {
    PromoCodeRedis.remove(REDIS_CONFIG.promoHomeRedis)
    res.status(200).send({ msg: 'Redis store PromoHome cleared' })
    
})
}