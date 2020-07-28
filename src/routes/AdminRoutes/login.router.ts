import { Router } from "express";
import verifyToken from "../../middleware/jwt";
import LoginService from "../../service/login.service";
import Admin from "../../models/admin.model";
import LoginController from "../../controller/login.controller";
import CONFIG from "../../config";

const loginRouter = Router()
const loginService = new LoginService(Admin)
const loginController = new LoginController(loginService, CONFIG.ADMIN_JWT_KEY, '30 days')

loginRouter.post("/create", loginController.post)
loginRouter.post("/",loginController.login)

export default loginRouter
