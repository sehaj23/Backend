import { Router } from "express";
import VendorverifyToken from "../../middleware/VendorJwt";
import RevenueService from "../../service/VendorService/revenue.service";
const revenueRouter = Router()
const rr = new RevenueService()


revenueRouter.get("/",rr.get)

export default revenueRouter