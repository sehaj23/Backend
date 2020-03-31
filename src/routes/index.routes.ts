import { Router } from "express";
import adminRouter from "./admin.router";
import designerRouter from "./designer.router";
import eventRouter from "./event.router";
import loginRouter from "./login.router";
import vendorRouter from "./vendor.router";
import makeupArtistRouter from "./makeupArtist.route";

const router = Router();

router.use("/admin", adminRouter);
router.use("/designer", designerRouter);
router.use("/event", eventRouter);
router.use("/login", loginRouter);
router.use("/vendor", vendorRouter);
router.use("/makeupArtist", makeupArtistRouter)

export default router
