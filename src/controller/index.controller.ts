import { Router } from "express";
import loginRouter from "./login.controller";
import adminRouter from "./admin.controller";
import eventRouter from "./event.controller";

const indexRouter = Router()

indexRouter.use("/login", loginRouter)
indexRouter.use("/admin", adminRouter)
indexRouter.use("/event", eventRouter)

export default indexRouter