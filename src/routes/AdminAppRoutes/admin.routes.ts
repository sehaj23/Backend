import { Router } from "express";
import verifyToken from "../../middleware/jwt";
import AdminService from "../../service/admin.service";
import AdminController from "../../controller/admin.controller";
import Admin from "../../models/admin.model";

const adminRouter = Router()
const adminService = new AdminService(Admin)
const adminController = new AdminController(adminService)

adminRouter.put("/fcm-token",verifyToken,adminController.updateFCM)
adminRouter.patch("/fcm-token",verifyToken,adminController.deleteFcm)


export default adminRouter