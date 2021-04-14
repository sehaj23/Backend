import { Router } from "express";
import adminRouter from "./admin.router";
import bookingRouter from "./booking.router";
import designerRouter from "./designer.router";
import eventRouter from "./event.router";
import loginRouter from "./login.router";
import makeupArtistRouter from "./makeupArtist.route";
import offerRouter from "./offer.router";
import promoCodeRouter from "./promo-code.router";
import referralRouter from "./referral.router";
import reportAppRouter from "./report-app.router";
import revenueRouter from "./revenue.router";
import reviewsSalonRouter from "./reviews.router";
import reportsSalonRouter from "./salon-reports.router";
import salonRouter from "./salon.router";
import userRouter from "./user.router";
import vendorRouter from "./vendor.router";
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
router.use("/reviews",reviewsSalonRouter)
router.use("/revenue", revenueRouter)
router.use("/promo-code", promoCodeRouter)
router.use("/report-app", reportAppRouter)
router.use("/report-salon",reportsSalonRouter)
router.use("/referrals",referralRouter)
router.use("/zattire-services", zattireServiceRouter)

export default router
