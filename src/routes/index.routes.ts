import { Router } from "express";
import adminRouter from "./admin.router";


const router = Router()

router.use("/admin", adminRouter)

export default router