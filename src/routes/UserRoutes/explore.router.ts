import { Router } from "express";
import ExploreController from "../../controller/explore.controller";
import verifyToken from "../../middleware/jwt";

import Explore from "../../models/explore.model";
import ExploreService from "../../service/explore.service";

const exploreRouter = Router()
const exploreService = new ExploreService(Explore)
const exploreController = new ExploreController(exploreService)



exploreRouter.get("/:id",verifyToken,exploreController.getId)
exploreRouter.get("/salon/:salonID",verifyToken,exploreController.getExploreBySalonId)
exploreRouter.get("/all",verifyToken,exploreController.getExploreByCreatedAt)

export default exploreRouter