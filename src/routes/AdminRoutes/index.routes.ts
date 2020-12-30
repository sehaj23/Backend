import { Router } from "express";
import adminRouter from "./admin.router";
import bookingRouter from "./booking.router";
import designerRouter from "./designer.router";
import eventRouter from "./event.router";
import loginRouter from "./login.router";
import makeupArtistRouter from "./makeupArtist.route";
import offerRouter from "./offer.router";
import promoCodeRouter from "./promo-code.router";
import revenueRouter from "./revenue.router";
import salonRouter from "./salon.router";
import userRouter from "./user.router";
import vendorRouter from "./vendor.router";
import zattireServiceRouter from "./zattire-services.router";

const router = Router();

router.use("/admin", adminRouter);
router.use("/designer", designerRouter);
router.use("/event", eventRouter);
router.use("/login", loginRouter);
router.use("/vendor", vendorRouter);
router.use("/makeupArtist", makeupArtistRouter)
router.use("/user", userRouter)
router.use("/booking", bookingRouter)
router.use("/salon", salonRouter)
router.use("/offer", offerRouter)
router.use("/revenue", revenueRouter)
router.use("/promo-code", promoCodeRouter)
router.use("/zattire-services",zattireServiceRouter)

export default router
