import { Request, Response } from "express";
import { ExploreSI } from "../interfaces/explore.interface";
import controllerErrorHandler from "../middleware/controller-error-handler.middleware";
import { userJWTVerification } from "../middleware/User.jwt";
import ExploreFavouriteService from "../service/explore-favourite.service";
import ExploreService from "../service/explore.service";
import logger from "../utils/logger";
import BaseController from "./base.controller";

export default class ExploreController extends BaseController {
  service: ExploreService;
  exploreFavouriteService:ExploreFavouriteService
  constructor(service: ExploreService,exploreFavouriteService:ExploreFavouriteService) {
    super(service);
    this.service = service;
    this.exploreFavouriteService=exploreFavouriteService
  }


  getExploreBySalonId = controllerErrorHandler(
    async (req: Request, res: Response) => {
        if(!req.params.salonID){
            return res.status(400).send({message:"Please send salonID"})
        }
        let getFavourites
      const salonID = req.params.salonID
      const explore = await this.service.getExploreBySalonId({salon_id:salonID});
      const token = req.headers?.authorization && req.headers?.authorization.split(' ')[1];
      if(token){
      const decoded = await userJWTVerification(token)
      //@ts-ignore
      if(decoded._id){
        const exploreId = []
        explore.explore.map((e)=>{
          exploreId.push(e._id)
        })
        //@ts-ignore
       getFavourites =  await this.exploreFavouriteService.getFavouriteForExplore(decoded._id,exploreId)
       
      }
      if(getFavourites.length>0){
        let index
        getFavourites.map((e)=>{
        index = explore.explore.findIndex(o=>o._id.toString()===e.explore_id.toString())
          explore.explore[index].favourite=true
        })
    }
  }
      res.send({data:explore});
    }
  );
  getExploreByCreatedAt = controllerErrorHandler(
    async (req: Request, res: Response) => {
      let getFavourites
      const q = req.query
      const explore = await this.service.filterExplore(q)
      const token = req.headers?.authorization && req.headers?.authorization.split(' ')[1];
      if(token){
      const decoded = await userJWTVerification(token)
      //@ts-ignore
      if(decoded._id){
        const exploreId = []
        explore.explore.map((e)=>{
          exploreId.push(e._id)
        })
        //@ts-ignore
       getFavourites =  await this.exploreFavouriteService.getFavouriteForExplore(decoded._id,exploreId)
       
      }
      if(getFavourites.length>0){
        let index
        getFavourites.map((e)=>{
        index = explore.explore.findIndex(o=>o._id.toString()===e.explore_id.toString())
          explore.explore[index].favourite=true
        })
    }
  }
      res.send({data:explore});
    }
  );
  searchExploreByServiceName = controllerErrorHandler(
    async (req: Request, res: Response) => {
      const phrase = req.query.phrase
      let getFavourites
      let explore = await this.service.searchInExplore(phrase)
      const token = req.headers?.authorization && req.headers?.authorization.split(' ')[1];
      if(token){
        const decoded = await userJWTVerification(token)
        //@ts-ignore
        if(decoded._id){
          const exploreId = []
          explore.map((e)=>{
            exploreId.push(e._id)
          })
          //@ts-ignore
         getFavourites =  await this.exploreFavouriteService.getFavouriteForExplore(decoded._id,exploreId)
         
        }
        if(getFavourites.length>0){
          let index
          //@ts-ignore
          getFavourites.map((e)=>{
          index = explore.findIndex(o=>o._id.toString()===e.explore_id.toString())
         
            explore[index].favourite=true
          })
      }
    }
      res.send({data:explore});
    }
  )
  filterExplore = controllerErrorHandler(
    async (req: Request, res: Response) => {
      const q = req.query
      let getFavourites
      const explore = await this.service.filterExplore(q)
      const token = req.headers?.authorization && req.headers?.authorization.split(' ')[1];
      if(token){
        const decoded = await userJWTVerification(token)
        //@ts-ignore
        if(decoded._id){
          const exploreId = []
          explore.explore.map((e)=>{
            exploreId.push(e._id)
          })
          //@ts-ignore
         getFavourites =  await this.exploreFavouriteService.getFavouriteForExplore(decoded._id,exploreId)
         
        }
        if(getFavourites.length>0){
          let index
          getFavourites.map((e)=>{
          index = explore.explore.findIndex(o=>o._id.toString()===e.explore_id.toString())
            explore.explore[index].favourite=true
          })
      }
    }
      res.send(explore);
    }
  )

  getExploreProductByIDwithSimilarProducts= controllerErrorHandler(
    async (req: Request, res: Response) => {
      let getFavourites
      const id = req.params.id
      const q:any= req.query
      const pageNumber: number = parseInt(q.page_number || 1)
      let pageLength: number = parseInt(q.page_length || 25)
      pageLength = (pageLength > 100) ? 100 : pageLength
      const skipCount = (pageNumber - 1) * pageLength
      let explore = await this.service.getById(id) as ExploreSI
      const multipleKeyWords = explore.service_name.split(" ")
      const getSimilarProduct = await this.service.getSimilarProducts(q,explore.salon_id,multipleKeyWords,explore._id)
      const token = req.headers?.authorization && req.headers?.authorization.split(' ')[1];
      if(token){
      const decoded = await userJWTVerification(token)
      //@ts-ignore
      if(decoded._id){
        const exploreId = []
          exploreId.push(req.params.id)
        //@ts-ignore
       getFavourites =  await this.exploreFavouriteService.getFavouriteForExplore(decoded._id,exploreId)
       
      }
      if(getFavourites.length>0){
        explore = explore.toObject()
        //@ts-ignore
        explore.favourite=true
    }
  }
      res.send({explore:explore,similarProducts:getSimilarProduct});
    }
  );


}