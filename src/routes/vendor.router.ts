import { Router } from "express";
import verifyToken from "../middleware/jwt";
import VendorService from "../service/vendor.service";

const vendorRouter = Router()
vendorRouter.post("/", verifyToken, VendorService.post)
vendorRouter.get("/", verifyToken, VendorService.get)
vendorRouter.get("/:id", verifyToken, VendorService.getId)
vendorRouter.put("/:id", verifyToken, VendorService.put)

export default vendorRouter
