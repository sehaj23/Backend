import { Router } from "express";
import loginRouter from "./login.router";
import designerRouter from "./designer.router";
import makeupArtistRouter from "./makeupartist.router"
import salonRouter from "./salon.router";
import bookingRouter from "./booking.router"
import offerRouter from "./offer.router"
import reviewsRouter from "./reviews.router"
import revenueRouter from "./revenue.router"
import dashboardRouter from "./dashboard.router";
import userRouter from "./user.router";


const Vendorrouter = Router();


Vendorrouter.use("/login", loginRouter);
Vendorrouter.use("/designer", designerRouter);
Vendorrouter.use("/makeupArtist", makeupArtistRouter);
Vendorrouter.use("/bookings",bookingRouter)
Vendorrouter.use("/salon",salonRouter)
Vendorrouter.use("/offer",offerRouter)
Vendorrouter.use("/reviews",reviewsRouter)
Vendorrouter.use("/revenue",revenueRouter)
Vendorrouter.use("/dashboard", dashboardRouter)
Vendorrouter.use("/user",userRouter)


export default Vendorrouter
