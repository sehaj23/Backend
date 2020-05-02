import { Router } from "express";
import verifyToken from "../../middleware/jwt";
import AdminService from "../../service/AdminService/admin.service";

const adminRouter = Router()
adminRouter.get("/", verifyToken, AdminService.get)
adminRouter.post("/", AdminService.post)
adminRouter.put("/", verifyToken, AdminService.put)

export default adminRouter