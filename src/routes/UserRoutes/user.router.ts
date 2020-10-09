import { Router } from "express";

import UserService from "../../service/user.service";

import CONFIG from "../../config";
import User from "../../models/user.model";
import UserController from "../../controller/user.controller";
import UserverifyToken from "../../middleware/User.jwt";
import Booking from "../../models/booking.model";
import FeedbackService from "../../service/feedback.service";
import Feedback from "../../models/feedback.model";

const userRouter = Router()
const feedbackService = new  FeedbackService(Feedback)
const userService = new UserService(User,Booking)

const userController= new UserController(userService,feedbackService)




userRouter.get("/info",UserverifyToken,userController.getUser)
userRouter.patch("/update",UserverifyToken,userController.update)
userRouter.patch("/password",UserverifyToken,userController.updatePassword)
userRouter.get("/bookings",UserverifyToken,userController.pastBooking)
userRouter.get("/address",UserverifyToken,userController.getAddress)
userRouter.post("/address",UserverifyToken,userController.addAddress)
userRouter.patch("/address/:addressId",UserverifyToken,userController.updateAddress)
userRouter.delete("/address/:addressId",UserverifyToken,userController.deleteAddress)
userRouter.put("/profile-photo",UserverifyToken,userController.putProfilePic)
userRouter.patch('/favourite',UserverifyToken,userController.addToFavourites)
userRouter.get('/favourite',UserverifyToken,userController.getFavourites)
userRouter.patch('/favourite/delete',UserverifyToken,userController.removeFavourites)
userRouter.post("/feedback",UserverifyToken,userController.postFeedback)

export default userRouter
