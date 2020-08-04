import { Router } from "express"
import loginRouter from "./login.router"
import deviceInfoRouter from "./device-info.router"
import salonInfoRouter from "./salon.router"
import searchRouter from "./search.router"
import serviceRouter from "./service.router"
import bookingRouter from './booking.router'
import userRouter from "./user.router"

const Userrouter = Router()

Userrouter.use("/login", loginRouter)
Userrouter.use("/device-info", deviceInfoRouter)
Userrouter.use("/salon", salonInfoRouter)
Userrouter.use("/search", searchRouter)
Userrouter.use("/service", serviceRouter)
Userrouter.use("/booking", bookingRouter)
Userrouter.use("/user", userRouter)

export default Userrouter
