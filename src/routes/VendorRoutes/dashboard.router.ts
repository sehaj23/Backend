import { Router } from "express";
import DashboardService from "../../service/VendorService/dasboard.service";
import VendorverifyToken from "../../middleware/VendorJwt";

const dashboardRouter = Router()
const ds = new DashboardService()

dashboardRouter.get("/customerCount",VendorverifyToken,ds.customerCount)

export default dashboardRouter