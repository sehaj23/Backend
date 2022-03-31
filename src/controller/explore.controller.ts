import { Request, Response } from "express";
import { ExploreSI } from "../interfaces/explore.interface";
import controllerErrorHandler from "../middleware/controller-error-handler.middleware";
import { userJWTVerification } from "../middleware/User.jwt";
import { ExploreRedis } from "../redis/index.redis";
import ExploreFavouriteService from "../service/explore-favourite.service";
import ExploreService from "../service/explore.service";
import logger from "../utils/logger";
import REDIS_CONFIG from "../utils/redis-keys";
import BaseController from "./base.controller";

export default class ExploreController extends BaseController {
  service: ExploreService;
  exploreFavouriteService: ExploreFavouriteService;
  constructor(
    service: ExploreService,
    exploreFavouriteService: ExploreFavouriteService
  ) {
    super(service);
    this.service = service;
    this.exploreFavouriteService = exploreFavouriteService;
  }

  getExploreBySalonId = controllerErrorHandler(
    async (req: Request, res: Response) => {
      if (!req.params.salonID) {
        return res.status(400).send({ message: "Please send salonID" });
      }
      let getFavourites;
      let explore
      const salonID = req.params.salonID;
      const cachedExplore = await ExploreRedis.get(REDIS_CONFIG.getExplore, req.query);
      if (cachedExplore == null) {
       explore = await this.service.getExploreBySalonId(salonID,req.query);
      }else{
        explore  = JSON.parse(cachedExplore)
      }
      const token =
        req.headers?.authorization && req.headers?.authorization.split(" ")[1];
      if (token) {
        const decoded = await userJWTVerification(token);
        //@ts-ignore
        if (decoded?._id !== undefined) {
          const exploreId = [];
          explore.explore.map((e) => {
            exploreId.push(e?._id);
          });
        
          getFavourites =
            await this.exploreFavouriteService.getFavouriteForExplore(
                //@ts-ignore
              decoded?._id,
              exploreId
            );
        
        if (getFavourites.length > 0) {
          let index;
          getFavourites.map((e) => {
            index = explore.explore.findIndex(
              (o) => o._id.toString() === e.explore_id.toString()
            );
            explore.explore[index].favourite = true;
          });
        }
      }
    }
      res.send({ data: explore });
    }
  );
  getExploreByCreatedAt = controllerErrorHandler(
    async (req: Request, res: Response) => {
      let getFavourites;
      let explore;
      const q = req.query;
      const cachedExplore = await ExploreRedis.get(REDIS_CONFIG.getExplore, q);
      if (cachedExplore == null) {
        console.log("not redis")
        explore = await this.service.filterExplore(q);
        await ExploreRedis.set(REDIS_CONFIG.getExplore, explore, q);
      } else {
        explore = JSON.parse( cachedExplore);
      }
      const token =
        req.headers?.authorization && req.headers?.authorization.split(" ")[1];
      if (token) {
        const decoded = await userJWTVerification(token);
        //@ts-ignore
        if (decoded?._id !== undefined) {
          const exploreId = [];
          explore.explore.map((e) => {
            exploreId.push(e._id);
          });
        
          getFavourites =
            await this.exploreFavouriteService.getFavouriteForExplore(
                //@ts-ignore
              decoded._id,
              exploreId
            );
        
        if (getFavourites.length > 0) {
          let index;
          getFavourites.map((e) => {
            index = explore.explore.findIndex(
              (o) => o._id.toString() === e.explore_id.toString()
            );
            explore.explore[index].favourite = true;
          });
        }
      }
    }
      res.send({ data: explore });
    }
  );
  searchExploreByServiceName = controllerErrorHandler(
    async (req: Request, res: Response) => {
      const phrase = req.query.phrase;
      let getFavourites;
      let explore;
      const cachedExplore = await ExploreRedis.get(
        REDIS_CONFIG.exploreSearchPhrase,
        phrase
      );
      if (cachedExplore == null) {
        explore = await this.service.searchInExplore(phrase);
        await ExploreRedis.set(
          REDIS_CONFIG.exploreSearchPhrase,
          explore,
          phrase
        );
      } else {
        explore = cachedExplore;
      }

      const token =
        req.headers?.authorization && req.headers?.authorization.split(" ")[1];
      if (token) {
        const decoded = await userJWTVerification(token);
        //@ts-ignore
        if (decoded?._id !== undefined) {
          const exploreId = [];
          explore.map((e) => {
            exploreId.push(e._id);
          });
      
          getFavourites =
            await this.exploreFavouriteService.getFavouriteForExplore(
                  //@ts-ignore
              decoded._id,
              exploreId
            );
        
        if (getFavourites.length > 0) {
          let index;
          //@ts-ignore
          getFavourites.map((e) => {
            index = explore.findIndex(
              (o) => o._id.toString() === e.explore_id.toString()
            );

            explore[index].favourite = true;
          });
        }
      }
    }
      res.send({ data: explore });
    }
  );
  filterExplore = controllerErrorHandler(
    async (req: Request, res: Response) => {
      const q = req.query;
      let getFavourites;
      let explore;
      const cachedExplore = await ExploreRedis.get(REDIS_CONFIG.getExplore, q);
      if (cachedExplore == null) {
        explore = await this.service.filterExplore(q);
        await ExploreRedis.set(REDIS_CONFIG.getExplore, explore, q);
      } else {
        explore =  JSON.parse( cachedExplore);
      }

      const token =
        req.headers?.authorization && req.headers?.authorization.split(" ")[1];
      if (token) {
        const decoded = await userJWTVerification(token);
        //@ts-ignore
        if (decoded?._id !== undefined) {
          const exploreId = [];
          explore.explore.map((e) => {
            exploreId.push(e._id);
          });
         
          getFavourites =
            await this.exploreFavouriteService.getFavouriteForExplore(
               //@ts-ignore
              decoded._id,
              exploreId
            );
        
        if (getFavourites.length > 0) {
          let index;
          getFavourites.map((e) => {
            index = explore.explore.findIndex(
              (o) => o._id.toString() === e.explore_id.toString()
            );
            explore.explore[index].favourite = true;
          });
        }
      }
    }
      res.send(explore);
    }
  );

  getExploreProductByIDwithSimilarProducts = controllerErrorHandler(
    async (req: Request, res: Response) => {
      let getFavourites;
      let getSimilarProduct;
      const id = req.params.id;
      const q: any = req.query;
      const pageNumber: number = parseInt(q.page_number || 1);
      let pageLength: number = parseInt(q.page_length || 25);
      pageLength = pageLength > 100 ? 100 : pageLength;
      const skipCount = (pageNumber - 1) * pageLength;
      const cachedExplore = await ExploreRedis.get(
        REDIS_CONFIG.getExploreByID,
        id
      );
      let explore;
      if (cachedExplore == null) {
        explore = (await this.service.getById(id)) as ExploreSI;

        const multipleKeyWords = explore.service_name.split(" ");
        getSimilarProduct = await this.service.getSimilarProducts(
          q,
          explore.salon_id,
          multipleKeyWords,
          explore._id
        );
        const token =
          req.headers?.authorization &&
          req.headers?.authorization.split(" ")[1];
        if (token) {
          const decoded = await userJWTVerification(token);
          //@ts-ignore
          if (decoded?._id !== undefined) {
            const exploreId = [];
            exploreId.push(req.params.id);
          
            getFavourites =
              await this.exploreFavouriteService.getFavouriteForExplore(
                  //@ts-ignore
                decoded._id,
                exploreId
              );
          
          if (getFavourites.length > 0) {
            explore = explore.toObject();
            //@ts-ignore
            explore.favourite = true;
          }
        }
      }
        await ExploreRedis.set(
          REDIS_CONFIG.getExploreByID,
          { explore, getSimilarProduct },
          id
        );
      } else {
        return res.status(200).send( JSON.parse( cachedExplore))
      }
      res.send({ explore: explore, similarProducts: getSimilarProduct });
    }
  );

  clearExploreRedisCreatedAt = controllerErrorHandler(
    async (req: Request, res: Response) => {
      const key = REDIS_CONFIG.getExplore;
      await ExploreRedis.remove(key);
      res.status(200).send({ message: "Explore cleared createdAt" });
    }
  );
  clearexploreSearchPhrase = controllerErrorHandler(
    async (req: Request, res: Response) => {
      const key = REDIS_CONFIG.exploreSearchPhrase;
      await ExploreRedis.remove(key);
      res.status(200).send({ message: "Explore cleared phrase" });
    }
  );
  clearexploreByID = controllerErrorHandler(
    async (req: Request, res: Response) => {
      const key = REDIS_CONFIG.getExploreByID;
      await ExploreRedis.remove(key);
      res.status(200).send({ message: "Explore cleared ID" });
    }
  );
}
