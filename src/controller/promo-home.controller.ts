import PromoHomeService from "../service/promo-home.service"
import { Request, Response } from 'express';
import BaseController from "./base.controller";
import controllerErrorHandler from "../middleware/controller-error-handler.middleware";
import { PromoCodeRedis } from "../redis/index.redis";

export default class PromoHomeController extends BaseController {
    service:PromoHomeService
    constructor(service:PromoHomeService){
    super(service)
        this.service=service
}

getActivePromo = controllerErrorHandler(async (req: Request, res: Response) => {
    let out
    const redisKey = "promoHomeRedis"
    const promo = await PromoCodeRedis.get(redisKey)
    if(promo == null){
        out = await this.service.get({active:true})
        PromoCodeRedis.set(redisKey,out)
}else{
    out = JSON.parse(promo)
}
        res.status(200).send(out)
})

clearActivePromo=controllerErrorHandler(async (req: Request, res: Response) => {
    const redisKey = "promoHomeRedis"
    PromoCodeRedis.remove(redisKey)
    res.status(200).send({ msg: 'Redis store PromoHome cleared' })
    
})
}