import { Router } from "express";
import verifyToken from "../middleware/jwt";
import VendorService from "../service/vendor.service";
import BookinkService from "../service/booking.service";

const bookingRouter = Router()
const vs = new BookinkService()

bookingRouter.post("/", verifyToken, vs.post)
bookingRouter.get("/", verifyToken, vs.get)
bookingRouter.get("/:id", verifyToken, vs.getId)
bookingRouter.put("/:id", verifyToken, vs.put)
bookingRouter.post("/salon-emp/:salonId", vs.getSalonEmployees)

export default bookingRouter
