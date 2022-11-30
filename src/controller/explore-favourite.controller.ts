import { Request, Response } from "express";
import mongoose from "../database";
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
      //@ts-ignore
      const checkFavourite = await this.service.get({ user_id: mongoose.Types.ObjectId(req.userId), explore_id: mongoose.Types.ObjectId(explore_id) })
      if (checkFavourite.length > 0) {
        return res.status(400).send({ message: "already in favourites" })
      }
      const addToFavourites = await this.service.addToFavourites(
        //@ts-ignore
        req.userId,
        explore_id
      );
      return res.status(200).send({ data: addToFavourites });
    }
  );
  deleteExploreFavourites = controllerErrorHandler(
    async (req: Request, res: Response) => {
      const { explore_id } = req.body;

      const deleteFavourites = await this.service.deleteFavourites(
        //@ts-ignore
        req.userId,
        explore_id
      );
      return res.status(200).send({ data: deleteFavourites });
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
      if (typeof (exploreFavourites) === 'string') {
        exploreFavourites = JSON.parse(exploreFavourites)
      }
      if (typeof (salonfavorites) === 'string') {
        salonfavorites = JSON.parse(salonfavorites)
      }
      const out = { exploreFavourites, salonfavorites };
      return res.status(200).send(out);
    }
  );
}
