import { Router } from "express"
import bookingRouter from './booking.router'
import cartRouter from "./cart.router"
import deviceInfoRouter from "./device-info.router"
import loginRouter from "./login.router"
import otpAppRouter from "./otp.route"
import promoCodeRouter from "./promo-code.router"
import reportAppRouter from "./report-app.route"
import salonInfoRouter from "./salon.router"
import searchRouter from "./search.router"
import serviceRouter from "./service.router"
import userRouter from "./user.router"

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

export default Userrouter
