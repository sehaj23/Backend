import { Router } from "express"
import RevenueController from "../../controller/revenue.controller"
import verifyToken from "../../middleware/jwt"
import Booking from "../../models/booking.model"
import RevenueService from "../../service/revenue.service"

const revenueRouter = Router()

const revenueService = new RevenueService(Booking)
const revenueController = new RevenueController(revenueService)

revenueRouter.get("/", verifyToken,  revenueController.adminTotalRevenue)
revenueRouter.get("/salons", verifyToken, revenueController.adminRevenueBySalon)

export default revenueRouter