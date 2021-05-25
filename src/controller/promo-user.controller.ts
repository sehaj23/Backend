
import { Request, Response } from 'express';
import BaseController from "./base.controller";
import controllerErrorHandler from "../middleware/controller-error-handler.middleware";
import { PromoCodeRedis } from "../redis/index.redis";
import PromoUserService from '../service/promo-user.service';

export default class PromoUserController extends BaseController {
    service:PromoUserService
    constructor(service:PromoUserService){
    super(service)
        this.service=service
}
}