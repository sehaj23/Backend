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


exploreRouter.get("/all",exploreController.getExploreByCreatedAt)
exploreRouter.get("/info/:id",exploreController.getExploreProductByIDwithSimilarProducts)
exploreRouter.get("/salon/:salonID",exploreController.getExploreBySalonId)
// exploreRouter.get("/search",exploreController.searchExploreByServiceName)
// exploreRouter.get("/filter",exploreController.filterExplore)
exploreRouter.get("/clear/createdAt",exploreController.clearExploreRedisCreatedAt)
exploreRouter.get("/clear/phrase",exploreController.clearexploreSearchPhrase)
exploreRouter.get("/clear/id",exploreController.clearexploreByID)


export default exploreRouter