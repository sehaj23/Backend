import { Router } from "express";
import verifyToken from "../../middleware/jwt";
import AdminService from "../../service/AdminService/admin.service";
import AdminController from "../../controller/admin-controller/admin.controller";
import Admin from "../../models/admin.model";

const adminRouter = Router()
const adminService = new AdminService(Admin)
const adminController = new AdminController(adminService)
adminRouter.get("/", verifyToken, adminController.get)
adminRouter.post("/", adminController.post)
adminRouter.put("/", verifyToken, adminController.put)

/**
 * @note - One of the login route is in the login router.
 */
adminRouter.post("/login", adminController.login)

export default adminRouter