import { Router } from "express"
import ReviewsController from "../../controller/reviews.controller"

import verifyToken from "../../middleware/jwt"
import Review from "../../models/review.model"
import ReviewsServices from "../../service/reviews.service"




const reviewsSalonRouter = Router()
const reviewsSalonService=  new  ReviewsServices(Review)
const reviewsSalonController = new ReviewsController(reviewsSalonService)


reviewsSalonRouter.get("/:id",verifyToken, reviewsSalonController. getById )
reviewsSalonRouter.get("/salon/:id",verifyToken,reviewsSalonController.getReviewsBySalon)
reviewsSalonRouter.get("/user/:id",verifyToken,reviewsSalonController.getReviewsByUser)


export default reviewsSalonRouter