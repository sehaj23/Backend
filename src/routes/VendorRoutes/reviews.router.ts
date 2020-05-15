import { Router } from "express";
import VendorverifyToken from "../../middleware/VendorJwt";
import ReviewsService from "../../service/VendorService/reviews.service";
const reviewsRouter = Router()
const rs = new ReviewsService()



reviewsRouter.post("/",VendorverifyToken,rs.postReviews)
reviewsRouter.get("/",VendorverifyToken,rs.allReviews)
reviewsRouter.put("/reply/:id",VendorverifyToken,rs.replyReviews)
reviewsRouter.get("/new",VendorverifyToken,rs.newReviews)
reviewsRouter.put("/report/:id",VendorverifyToken,rs.reportReviews)

export default reviewsRouter