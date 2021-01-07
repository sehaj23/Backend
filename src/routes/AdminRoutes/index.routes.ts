import { Router } from "express";
import bookingRouter from "../UserRoutes/booking.router";
import loginRouter from "../UserRoutes/login.router";
import promoCodeRouter from "../UserRoutes/promo-code.router";
import salonRouter from "../UserRoutes/salon.router";
import userRouter from "../UserRoutes/user.router";
import revenueRouter from "../VendorAppRoutes/revenue.routes";
import vendorRouter from "../VendorAppRoutes/vendor.routes";
import designerRouter from "../VendorRoutes/designer.router";
import makeupArtistRouter from "../VendorRoutes/makeupartist.router";
import offerRouter from "../VendorRoutes/offer.router";
import adminRouter from "./admin.router";
import eventRouter from "./event.router";
import zattireServiceRouter from "./zattire-services.router";

/**
 * @swagger
 * tags:
 *  name: Admin
 *  description: This is to login as Admin and get the token
 */

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
router.use("/zattire-services", zattireServiceRouter)

export default router
