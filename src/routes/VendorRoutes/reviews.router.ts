import { Router } from "express";
import VendorverifyToken from "../../middleware/VendorJwt";
import ReviewsService from "../../service/reviews.service";

import Reviews from "../../models/review.model"
import ReviewsController from "../../controller/reviews.controller";
const reviewsRouter = Router()

const reviewsService = new ReviewsService(Reviews)
const revenueController = new ReviewsController(reviewsService)




reviewsRouter.post("/",VendorverifyToken,revenueController.postReviews)
reviewsRouter.get("/",VendorverifyToken,revenueController.allReviews)
reviewsRouter.put("/reply/:id",VendorverifyToken,revenueController.replyReviews)
reviewsRouter.get("/new",VendorverifyToken,revenueController.newReviews)
reviewsRouter.put("/report/:id",VendorverifyToken,revenueController.reportReviews)

export default reviewsRouter