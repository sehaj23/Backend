import { Router } from "express"
import loginRouter from "./login.router"
import deviceInfoRouter from "./device-info.router"
import salonInfoRouter from "./salon.router"
import searchRouter from "./search.router"

const Userrouter = Router()

Userrouter.use("/login", loginRouter)
Userrouter.use("/device-info", deviceInfoRouter)
Userrouter.use("/salon", salonInfoRouter)
Userrouter.use("/search", searchRouter)

export default Userrouter
