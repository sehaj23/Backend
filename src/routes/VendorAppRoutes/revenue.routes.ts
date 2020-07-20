import { Router } from "express";
import Booking from "../../models/booking.model"
import VendorverifyToken from "../../middleware/VendorJwt";
import RevenueService from "../../service/revenue.service";
import RevenueController from "../../controller/revenue.controller";
const revenueRouter = Router()
const revenueService = new RevenueService(Booking)
const revenueController = new RevenueController(revenueService)




revenueRouter.get("/",VendorverifyToken, revenueController.revenue) //total revenue of last 28 days (default). Filters can be used on this of startdate and end date

export default revenueRouter