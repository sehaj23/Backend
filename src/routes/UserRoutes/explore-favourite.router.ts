import { Router } from "express";
import ExploreFavouriteController from "../../controller/explore-favourite.controller";
import UserverifyToken from "../../middleware/User.jwt";
import Booking from "../../models/booking.model";
import FavouriteExplore from "../../models/favorite-explore.model";
import User from "../../models/user.model";
import ExploreFavouriteService from "../../service/explore-favourite.service";
import UserService from "../../service/user.service";


const exploreFavouriteRouter = Router()
const exploreFavouriteService = new ExploreFavouriteService(FavouriteExplore)
const userService = new UserService(User,Booking)
const exploreFavouriteController = new ExploreFavouriteController(exploreFavouriteService,userService)


exploreFavouriteRouter.post("/add",UserverifyToken, exploreFavouriteController.addToExploreFavourites)
exploreFavouriteRouter.get("/home-page",UserverifyToken,exploreFavouriteController.getExploreFavouritesAndSalonFavourites)
exploreFavouriteRouter.get("/",UserverifyToken,exploreFavouriteController.getExploreFavourites)



export default exploreFavouriteRouter