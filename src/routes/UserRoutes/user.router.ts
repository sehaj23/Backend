import { Router } from "express";

import UserService from "../../service/user.service";

import CONFIG from "../../config";
import User from "../../models/user.model";
import UserController from "../../controller/user.controller";
import UserverifyToken from "../../middleware/User.jwt";

const userRouter = Router()
const userService = new UserService(User)
const userController= new UserController(userService)


userRouter.get("/", UserverifyToken, userController.get)
userRouter.put("/:id", UserverifyToken, userController.put)
userRouter.put("/:id/photo", UserverifyToken, userController.putPhoto)
userRouter.get("/:id/photo", UserverifyToken, userController.getPhoto)

export default userRouter
