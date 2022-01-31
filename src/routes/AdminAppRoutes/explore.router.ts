import { Router } from "express";
import ExploreController from "../../controller/explore.controller";
import verifyToken from "../../middleware/jwt";

import Explore from "../../models/explore.model";
import ExploreService from "../../service/explore.service";

const exploreRouter = Router()
const exploreService = new ExploreService(Explore)
const exploreController = new ExploreController(exploreService)

exploreRouter.put("/:id",verifyToken,exploreController.put)
exploreRouter.post("/",verifyToken,exploreController.post)
exploreRouter.get("/",verifyToken,exploreController.get)
exploreRouter.delete("/:id",verifyToken,exploreController.delete)

export default exploreRouter