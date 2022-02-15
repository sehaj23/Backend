import { Request, Response } from "express";
import { ExploreSI } from "../interfaces/explore.interface";
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
  searchExploreByServiceName = controllerErrorHandler(
    async (req: Request, res: Response) => {
      const phrase = req.query.phrase
      const explore = await this.service.searchInExplore(phrase)
      res.send({data:explore});
    }
  )

  getExploreProductByIDwithSimilarProducts= controllerErrorHandler(
    async (req: Request, res: Response) => {
      const id = req.params.id
      const q:any= req.query
      const pageNumber: number = parseInt(q.page_number || 1)
      let pageLength: number = parseInt(q.page_length || 25)
      pageLength = (pageLength > 100) ? 100 : pageLength
      const skipCount = (pageNumber - 1) * pageLength
      const explore = await this.service.getById(id) as ExploreSI
      const multipleKeyWords = explore.service_name.split(" ")
      const getSimilarProduct = await this.service.getSimilarProducts(q,explore.salon_id,multipleKeyWords,explore._id)
      
      res.send({explore:explore,similarProducts:getSimilarProduct});
    }
  );


}