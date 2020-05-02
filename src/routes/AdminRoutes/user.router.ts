import { Router } from "express";
import verifyToken from "../../middleware/jwt";
import UserService from "../../service/AdminService/user.service";

const userRouter = Router()
const us = new UserService()

userRouter.post("/", verifyToken, us.post)
userRouter.get("/", verifyToken, us.get)
userRouter.get("/:id", verifyToken, us.getId)
userRouter.put("/:id", verifyToken, us.put)
userRouter.put("/:id/photo", verifyToken, us.putPhoto)
userRouter.get("/:id/photo", verifyToken, us.getPhoto)

export default userRouter
