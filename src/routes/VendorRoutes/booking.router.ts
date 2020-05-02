import { Router } from "express";
import VendorverifyToken from "../../middleware/jwt";
import BookinkService from "../../service/VendorService/booking.service";

const bookingRouter = Router()
const vs = new BookinkService()

bookingRouter.post("/", VendorverifyToken, vs.post)
bookingRouter.get("/", VendorverifyToken, vs.get)
bookingRouter.get("/:id", VendorverifyToken, vs.getId)
bookingRouter.put("/:id", VendorverifyToken, vs.put)
bookingRouter.get("/salon/:id",VendorverifyToken,vs.getSalonBookings)
bookingRouter.get("/makeupArtist/:id",VendorverifyToken,vs.getmakeupArtistBookings)
bookingRouter.get("/designer/:id",VendorverifyToken,vs.getDesignerBookings)
bookingRouter.get("/pending/salon/:id",VendorverifyToken,vs.getPendingSalonBookings)
bookingRouter.get("/pending/makeupArtist/:id",VendorverifyToken,vs.getPendingmakeupArtistBookings)
bookingRouter.get("/pending/designer/:id",VendorverifyToken,vs.getPendingDesignerBookings)
bookingRouter.patch("/updatestatus/:id",VendorverifyToken,vs.updateStatusBookings)

export default bookingRouter
