import { Router } from "express";
import ExploreFavouriteController from "../../controller/explore-favourite.controller";
import UserverifyToken from "../../middleware/User.jwt";
import FavouriteExplore from "../../models/favorite-explore.model";
import ExploreFavouriteService from "../../service/explore-favourite.service";


const exploreFavouriteRouter = Router()
const exploreFavouriteService = new ExploreFavouriteService(FavouriteExplore)

const exploreFavouriteController = new ExploreFavouriteController(exploreFavouriteService)


exploreFavouriteRouter.post("/add",UserverifyToken, exploreFavouriteController.addToExploreFavourites)
exploreFavouriteRouter.get("/",UserverifyToken,exploreFavouriteController.getExploreFavourites)



export default exploreFavouriteRouter