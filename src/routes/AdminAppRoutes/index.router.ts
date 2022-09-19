import { Router } from "express";
import adminRouter from "./admin.routes";
import bookingRouter from "./booking.router";
import exploreRouter from "./explore.router";
import locationRouter from "./location.router";
import loginRouter from "./login.router";
import promoCodeRouter from "./promocode.router";
import referralRouter from "./referral.router";
import salonRouter from "./salon.router";
import userRouter from "./user.router";
import vendorRouter from "./vendor.routes";
import feedbackRouter from "./feedback.router";

import walletTransactionRouter from "./wallet-trasanctionr.outer";
import zattireServiceRouter from "./zattire-service.router";

const AdminApprouter = Router();
AdminApprouter.use("/admin",adminRouter)
AdminApprouter.use("/login", loginRouter);
AdminApprouter.use("/booking", bookingRouter)
AdminApprouter.use("/promocode",promoCodeRouter)
AdminApprouter.use("/wallet",walletTransactionRouter)
AdminApprouter.use("/salon", salonRouter);
AdminApprouter.use('/user', userRouter)
AdminApprouter.use("/location",locationRouter)
AdminApprouter.use('/explore',exploreRouter)
AdminApprouter.use('/vendor',vendorRouter)
AdminApprouter.use("/zattire-services",zattireServiceRouter)
AdminApprouter.use("/vendor", vendorRouter);
AdminApprouter.use("/referral",referralRouter)
AdminApprouter.use("/feedback", feedbackRouter);

export default AdminApprouter