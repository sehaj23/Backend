import { Router } from "express";
import VendorverifyToken from "../../middleware/VendorJwt";
import BookinkService from "../../service/VendorService/booking.service";

const bookingRouter = Router()
const vs = new BookinkService()

bookingRouter.post("/", VendorverifyToken, vs.post)
bookingRouter.get("/:id", VendorverifyToken, vs.getId)
bookingRouter.get("/", VendorverifyToken, vs.getbookings) //filter can be used here
bookingRouter.put("/assignEmployee/:id", VendorverifyToken, vs.assigneEmployeeBookings)
bookingRouter.get("/all/salon/:id",VendorverifyToken,vs.getAllSalonBookings)  //test cases left
bookingRouter.get("/all/makeupArtist/:id",VendorverifyToken,vs.getAllMuaBookings) //test cases left
bookingRouter.get("/all/designer/:id",VendorverifyToken,vs.getAllDesignerBookings) //test cases left
bookingRouter.get("/salon/:id",VendorverifyToken,vs.getSalonBookings) // bookings except pending
bookingRouter.get("/makeupArtist/:id",VendorverifyToken,vs.getmakeupArtistBookings) //booking except pending
bookingRouter.get("/designer/:id",VendorverifyToken,vs.getDesignerBookings) // booking except pending
bookingRouter.get("/pending/salon/:id",VendorverifyToken,vs.getPendingSalonBookings)
bookingRouter.get("/pending/makeupArtist/:id",VendorverifyToken,vs.getPendingmakeupArtistBookings)
bookingRouter.get("/pending/designer/:id",VendorverifyToken,vs.getPendingDesignerBookings)
bookingRouter.patch("/updatestatus/:id",VendorverifyToken,vs.updateStatusBookings)
bookingRouter.patch("/reschedule/:id",VendorverifyToken,vs.reschedulebooking)


export default bookingRouter
