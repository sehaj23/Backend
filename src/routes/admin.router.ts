import { Router } from "express";
import verifyToken from "../middleware/jwt";
import AdminService from "../service/admin.service";

const adminRouter = Router()
adminRouter.get("/", verifyToken, AdminService.get)
adminRouter.post("/", verifyToken, AdminService.post)
adminRouter.put("/", verifyToken, AdminService.put)

export default adminRouter