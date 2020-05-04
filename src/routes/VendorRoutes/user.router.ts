import { Router } from "express";
import VendorverifyToken from "../../middleware/VendorJwt";
import UserService from "../../service/VendorService/user.service";

const userRouter = Router()
const us = new UserService()

userRouter.post("/", VendorverifyToken, us.post)
userRouter.get("/", VendorverifyToken, us.get)
userRouter.get("/:id", VendorverifyToken, us.getId)
userRouter.put("/:id", VendorverifyToken, us.put)
userRouter.put("/:id/photo", VendorverifyToken, us.putPhoto)
userRouter.get("/:id/photo", VendorverifyToken, us.getPhoto)

export default userRouter
