import { Router } from "express";
import VendorverifyToken from "../../middleware/VendorJwt";
import ReviewsService from "../../service/reviews.service";

import Reviews from "../../models/review.model"
import ReviewsController from "../../controller/reviews.controller";
const reviewsRouter = Router()

const reviewsService = new ReviewsService(Reviews)
const reviewsController = new ReviewsController(reviewsService)




reviewsRouter.post("/",VendorverifyToken,reviewsController.postReviews)
reviewsRouter.get("/",VendorverifyToken,reviewsController.allReviews)
reviewsRouter.put("/reply/:id",VendorverifyToken,reviewsController.replyReviews)
reviewsRouter.get("/new",VendorverifyToken,reviewsController.newReviews)
reviewsRouter.put("/report/:id",VendorverifyToken,reviewsController.reportReviews)


export default reviewsRouter