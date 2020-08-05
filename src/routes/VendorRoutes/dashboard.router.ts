import { Router } from "express";
import VendorverifyToken from "../../middleware/VendorJwt";

const dashboardRouter = Router()

// dashboardRouter.get("/customerCount",VendorverifyToken,ds.customerCount)

export default dashboardRouter