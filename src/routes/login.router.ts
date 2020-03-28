import { Router } from "express";
import verifyToken from "../middleware/jwt";
import LoginService from "../service/login.service";

const loginRouter = Router()
loginRouter.post("/", LoginService.post)

export default loginRouter
