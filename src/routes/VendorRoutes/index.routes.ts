import { Router } from "express";
import loginRouter from "./login.router";
import designerRouter from "./designer.router";
import makeupArtistRouter from "./makeupartist.router"
import salonRouter from "./salon.router";
import bookingRouter from "./booking.router"
import employeeRouter from "./employee.router"
import serviceRouter from "./service.router"
import OfferRouter from "./offer.router"



const Vendorrouter = Router();


Vendorrouter.use("/login", loginRouter);
Vendorrouter.use("/designer", designerRouter);
Vendorrouter.use("/makeupArtist", makeupArtistRouter);
Vendorrouter.use("/bookings",bookingRouter)
Vendorrouter.use("/salon",salonRouter)
Vendorrouter.use("/employee",employeeRouter)
Vendorrouter.use("/service",serviceRouter)
Vendorrouter.use("/offer",OfferRouter)



export default Vendorrouter
