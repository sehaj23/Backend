import { Router } from "express";
import ExploreController from "../../controller/explore.controller";
import VendorverifyToken from "../../middleware/VendorJwt";

import Explore from "../../models/explore.model";
import FavouriteExplore from "../../models/favorite-explore.model";
import ExploreFavouriteService from "../../service/explore-favourite.service";
import ExploreService from "../../service/explore.service";

const exploreRouter = Router()
const exploreService = new ExploreService(Explore)
const exploreFavouriteService =  new ExploreFavouriteService(FavouriteExplore)
const exploreController = new ExploreController(exploreService,exploreFavouriteService)


exploreRouter.post("/",VendorverifyToken,exploreController.post)
exploreRouter.get("/",VendorverifyToken,exploreController.getWithPagination)
exploreRouter.put("/:id",VendorverifyToken,exploreController.put)
exploreRouter.delete("/:id",VendorverifyToken,exploreController.delete)
exploreRouter.get("/:id",VendorverifyToken,exploreController.getExploreProductByID)
exploreRouter.get("/salon/:salonID",VendorverifyToken,exploreController.getExploreBySalonId)

export default exploreRouter