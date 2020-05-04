import { Router } from "express";
import VendorverifyToken from "../../middleware/VendorJwt";
import service from "../../service/VendorService/service.service";

const serviceRouter = Router()
const ss = new service()

serviceRouter.post("/", VendorverifyToken, ss.createService)
serviceRouter.get("/",  VendorverifyToken, ss.getService)
serviceRouter.put("/edit/:id", VendorverifyToken, ss.updateService)
serviceRouter.delete("/delete/:id", VendorverifyToken, ss.deleteService)




export default serviceRouter