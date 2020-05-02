import { Router } from "express";
import verifyToken from "../../middleware/jwt";
import LoginService from "../../service/AdminService/login.service";

const loginRouter = Router()
loginRouter.post("/", LoginService.post)

export default loginRouter
