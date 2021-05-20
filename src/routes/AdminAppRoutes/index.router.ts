import { Router } from "express";
import bookingRouter from "./booking.router";
import loginRouter from "./login.router";

const AdminApprouter = Router();

AdminApprouter.use("/login", loginRouter);
AdminApprouter.use("/booking", bookingRouter)


export default AdminApprouter