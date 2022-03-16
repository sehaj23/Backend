import { Request, Response } from "express";
import controllerErrorHandler from "../middleware/controller-error-handler.middleware";
import ExploreFavouriteService from "../service/explore-favourite.service";
import UserService from "../service/user.service";
import BaseController from "./base.controller";

export default class ExploreFavouriteController extends BaseController {
  service: ExploreFavouriteService;
  userService: UserService;
  constructor(service: ExploreFavouriteService, userService: UserService) {
    super(service);
    this.service = service;
    this.userService = userService;
  }

  addToExploreFavourites = controllerErrorHandler(
    async (req: Request, res: Response) => {
      const { explore_id } = req.body;
     
      const addToFavourites = await this.service.addToFavourites(
           //@ts-ignore
        req.userId,
        explore_id
      );
      return res.status(200).send({ data: addToFavourites });
    }
  );

  getExploreFavourites = controllerErrorHandler(
    async (req: Request, res: Response) => {
      const q = req.query;
     
      const getExploreFavourites = await this.service.getFavourites(
           //@ts-ignore
        req.userId,
        q
      );
      return res.status(200).send({ data: getExploreFavourites });
    }
  );

  getExploreFavouritesAndSalonFavourites = controllerErrorHandler(
    async (req: Request, res: Response) => {
      const q = req.query;

      //@ts-ignore
      const getExploreFavouritesReq = this.service.getFavourites(req.userId, q);
     
      const getSalonfavoritesReq = this.userService.getFavourites(
           //@ts-ignore
        req.userId,
        q
      );
      let [exploreFavourites, salonfavorites] = await Promise.all([
        getExploreFavouritesReq,
        getSalonfavoritesReq,
      ]);
      if(typeof(exploreFavourites)==='string'){
        exploreFavourites= JSON.parse(exploreFavourites)
      }
      if(typeof(salonfavorites)==='string'){
        salonfavorites= JSON.parse(salonfavorites)
      }
      const out = { exploreFavourites, salonfavorites };
      return res.status(200).send(out);
    }
  );
}
