import { Request, Response } from "express";
import controllerErrorHandler from "../middleware/controller-error-handler.middleware";
import ExploreService from "../service/explore.service";
import logger from "../utils/logger";
import BaseController from "./base.controller";

export default class ExploreController extends BaseController {
  service: ExploreService;
  constructor(service: ExploreService) {
    super(service);
    this.service = service;
  }


  getExploreBySalonId = controllerErrorHandler(
    async (req: Request, res: Response) => {
        if(!req.params.salonID){
            return res.status(400).send({message:"Please send salonID"})
        }
        const salonID = req.params.salonID
      const explore = await this.service.getExploreBySalonId({salon_id:salonID});
      res.send({data:explore});
    }
  );
  getExploreByCreatedAt = controllerErrorHandler(
    async (req: Request, res: Response) => {
      const q = req.query
      const explore = await this.service.getWithPagination(q)
      res.send({data:explore});
    }
  );


}