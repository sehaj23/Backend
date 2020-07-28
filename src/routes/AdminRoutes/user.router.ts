import { Router } from "express";
import verifyToken from "../../middleware/jwt";
import UserService from "../../service/user.service";

import CONFIG from "../../config";
import User from "../../models/user.model";
import UserController from "../../controller/user.controller";

const userRouter = Router()
const userService = new UserService(User)
const userController= new UserController(userService)

userRouter.post("/", verifyToken, userController.post)
userRouter.get("/", verifyToken, userController.get)
userRouter.get("/:id", verifyToken, userController.getId)
userRouter.put("/:id", verifyToken, userController.put)
userRouter.put("/:id/photo", verifyToken, userController.putPhoto)
userRouter.get("/:id/photo", verifyToken, userController.getPhoto)

export default userRouter
