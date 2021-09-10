import { Router } from "express";
import adminRouter from "./admin.routes";
import bookingRouter from "./booking.router";
import loginRouter from "./login.router";
import promoCodeRouter from "./promocode.router";
import salonRouter from "./salon.router";

const AdminApprouter = Router();
AdminApprouter.use("/admin",adminRouter)
AdminApprouter.use("/login", loginRouter);
AdminApprouter.use("/booking", bookingRouter)
AdminApprouter.use("/promocode",promoCodeRouter)
AdminApprouter.use("/salon", salonRouter);


export default AdminApprouter