import { Router } from "express";
import VendorverifyToken from "../../middleware/VendorJwt";
import RevenueService from "../../service/VendorService/revenue.service";
const revenueRouter = Router()
const rr = new RevenueService()


revenueRouter.get("/",rr.revenue) //total revenue of last 28 days (default). Filters can be used on this of startdate and end date
revenueRouter.get("/total",rr.totalRevenue) //overall total revenue
revenueRouter.get("/booking/:id",rr.revenueByBookingId)


export default revenueRouter