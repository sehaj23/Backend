import { Router } from "express";
import adminRouter from "./admin.router";
import designerRouter from "./designer.router";
import eventRouter from "./event.router";
import loginRouter from "./login.router";
//import vendorRouter from "./vendor.router";
 import makeupArtistRouter from "./makeupArtist.route";
import userRouter from "./user.router";
import bookingRouter from "./booking.router"
import salonRouter from "./salon.router";
import offerRouter from "./offer.router";

const router = Router();

router.use("/admin", adminRouter);
router.use("/designer", designerRouter);
router.use("/event", eventRouter);
router.use("/login", loginRouter);
//router.use("/vendor", vendorRouter);
router.use("/makeupArtist", makeupArtistRouter)
router.use("/user", userRouter)
router.use("/booking", bookingRouter)
router.use("/salon", salonRouter)
router.use("/offer", offerRouter)

export default router
