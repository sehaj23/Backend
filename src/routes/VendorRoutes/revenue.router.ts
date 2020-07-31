import { Router } from "express";
import VendorverifyToken from "../../middleware/VendorJwt";
import RevenueService from "../../service/revenue.service";
import RevenueController from "../../controller/revenue.controller";
import Booking from "../../models/booking.model";
const revenueRouter = Router()

const revenueService = new RevenueService(Booking)
const revenueController = new RevenueController(revenueService)


revenueRouter.get("/",revenueController.revenue) //total revenue of last 28 days (default). Filters can be used on this of startdate and end date
revenueRouter.get("/total",revenueController.totalRevenue) //overall total revenue
revenueRouter.get("/booking/:id",revenueController.revenueByBookingId)


export default revenueRouter