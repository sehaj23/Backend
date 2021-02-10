import { Router } from "express"
import bookingRouter from './booking.router'
import cartRouter from "./cart.router"
import deviceInfoRouter from "./device-info.router"
import loginRouter from "./login.router"
import otpAppRouter from "./otp.route"
import promoCodeRouter from "./promo-code.router"
import refundRouter from "./refund.route"
import reportAppRouter from "./report-app.route"
import salonSearchRouter from "./salon-search.router"
import salonInfoRouter from "./salon.router"
import searchRouter from "./search.router"
import serviceRouter from "./service.router"
import userRouter from "./user.router"

/**
 * @swagger
 * tags:
 *  name: User
 *  description: User application routes
 */

const Userrouter = Router()

Userrouter.use("/login", loginRouter)
Userrouter.use("/device-info", deviceInfoRouter)
Userrouter.use("/salon", salonInfoRouter)
Userrouter.use("/search", searchRouter)
Userrouter.use("/service", serviceRouter)
Userrouter.use("/booking", bookingRouter)
Userrouter.use("/user", userRouter)
Userrouter.use("/cart", cartRouter)
Userrouter.use("/report-app", reportAppRouter)
Userrouter.use("/otp", otpAppRouter)
Userrouter.use("/promo-code", promoCodeRouter)
Userrouter.use("/salon-search", salonSearchRouter)
Userrouter.use("/refund", refundRouter)

export default Userrouter
