import { Router } from "express";
import RevenueController from "../../controller/revenue.controller";
import VendorverifyToken from "../../middleware/VendorJwt";
import Booking from "../../models/booking.model";
import RevenueService from "../../service/revenue.service";
const revenueRouter = Router()

const revenueService = new RevenueService(Booking)
const revenueController = new RevenueController(revenueService)


revenueRouter.get("/", VendorverifyToken, revenueController.revenue) //total revenue of last 28 days (default). Filters can be used on this of startdate and end date
revenueRouter.get("/total", VendorverifyToken, revenueController.totalRevenue) //overall total revenue
revenueRouter.get("/booking/:id", VendorverifyToken, revenueController.revenueByBookingId)


export default revenueRouter