import { Router } from "express";
import ExploreController from "../../controller/explore.controller";
import verifyToken from "../../middleware/jwt";

import Explore from "../../models/explore.model";
import ExploreService from "../../service/explore.service";

const exploreRouter = Router()
const exploreService = new ExploreService(Explore)
const exploreController = new ExploreController(exploreService)


exploreRouter.get("/all",exploreController.getExploreByCreatedAt)
exploreRouter.get("/info/:id",exploreController.getExploreProductByIDwithSimilarProducts)
exploreRouter.get("/salon/:salonID",exploreController.getExploreBySalonId)
exploreRouter.get("/search",exploreController.searchExploreByServiceName)

export default exploreRouter