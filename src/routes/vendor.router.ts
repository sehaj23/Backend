import { Router } from "express";
import verifyToken from "../middleware/jwt";
import VendorService from "../service/vendor.service";

const vendorRouter = Router()
const vs = new VendorService()

vendorRouter.post("/", verifyToken, vs.post)
vendorRouter.get("/", verifyToken, vs.get)
vendorRouter.get("/:id", verifyToken, vs.getId)
vendorRouter.put("/:id", verifyToken, vs.put)

export default vendorRouter
