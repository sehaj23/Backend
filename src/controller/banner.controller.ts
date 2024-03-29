import controllerErrorHandler from "../middleware/controller-error-handler.middleware";
import BannerService from "../service/banner.service";
import BaseController from "./base.controller";
import { Request, Response } from "express";
import { BannerRedis } from "../redis/index.redis";
import REDIS_CONFIG from "../utils/redis-keys";
import logger from "../utils/logger";

export default class BannerController extends BaseController {
  service: BannerService;
  constructor(service: BannerService) {
    super(service);
    this.service = service;
  }

  getActiveBanners = controllerErrorHandler(
    async (req: Request, res: Response) => {
      const key = REDIS_CONFIG.bannerForHomePage;
      let out;
      const getBanner = await BannerRedis.get(key);
      if (getBanner == null) {
        out = await this.service.getActiveBanners();
        BannerRedis.set(key, out);
      } else {
        out = JSON.parse(getBanner);
      }
      res.status(200).send(out);
    }
  );

  clearRedisBanner = controllerErrorHandler(
    async (req: Request, res: Response) => {
      BannerRedis.removeAll();
      res.status(200).send({ msg: "Redis store Banner cleared" });
    }
  );

  // this is a dummy method to test the endpoint
  getDeletedBanners = controllerErrorHandler(async (req: Request, res: Response) => { 
    if(req.params.id === 'admin'){
      // throw error
      logger.error('error not admin')
      res.status(400).send({msg : 'not admin'})
      return
    } else {
      // const out = await this.service.getDeletedBanners();
      res.status(200).send({id : req.params.id});
    }
  });
}
