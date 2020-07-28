import { Router } from "express";
import VendorverifyToken from "../../middleware/VendorJwt";
import UserService from "../../service/user.service";
import User from "../../models/user.model";

import LoginService from "../../service/login.service";
import CONFIG from "../../config";
import UserController from "../../controller/user.controller";

const userRouter = Router()

const userService = new UserService(User)
const userController= new UserController(userService)


userRouter.post("/", VendorverifyToken, userController.post)
userRouter.get("/", VendorverifyToken, userController.get)
userRouter.get("/:id", VendorverifyToken, userController.getId)
userRouter.put("/:id", VendorverifyToken, userController.put)
//userRouter.put("/:id/photo", VendorverifyToken, us.putPhoto)
userRouter.get("/:id/photo", VendorverifyToken, userController.getPhoto)

export default userRouter
