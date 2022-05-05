import { Router } from "express";
import ExploreController from "../../controller/explore.controller";
import verifyToken from "../../middleware/jwt";

import Explore from "../../models/explore.model";
import FavouriteExplore from "../../models/favorite-explore.model";
import ExploreFavouriteService from "../../service/explore-favourite.service";
import ExploreService from "../../service/explore.service";

const exploreRouter = Router()
const exploreService = new ExploreService(Explore)
const exploreFavouriteService =  new ExploreFavouriteService(FavouriteExplore)
const exploreController = new ExploreController(exploreService,exploreFavouriteService)


exploreRouter.post("/",verifyToken,exploreController.post)
exploreRouter.get("/",verifyToken,exploreController.getWithPagination)
exploreRouter.put("/:id",verifyToken,exploreController.put)
exploreRouter.delete("/:id",verifyToken,exploreController.delete)
exploreRouter.get("/:id",verifyToken,exploreController.getId)
exploreRouter.get("/salon/:salonID",verifyToken,exploreController.getExploreBySalonId)

export default exploreRouter