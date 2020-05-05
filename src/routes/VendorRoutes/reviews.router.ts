import { Router } from "express";
import VendorverifyToken from "../../middleware/VendorJwt";
import ReviewsService from "../../service/VendorService/reviews.service";
const reviewsRouter = Router()
const rs = new ReviewsService()



reviewsRouter.post("/",VendorverifyToken,rs.PostReviews)
reviewsRouter.get("/all",VendorverifyToken,rs.AllReviews)
reviewsRouter.put("/reply/:id",VendorverifyToken,rs.ReplyReviews)
reviewsRouter.get("/new",VendorverifyToken,rs.NewReviews)
reviewsRouter.put("/report/:id",VendorverifyToken,rs.ReportReviews)

export default reviewsRouter