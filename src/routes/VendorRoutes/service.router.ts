import { Router } from "express";
import VendorverifyToken from "../../middleware/VendorJwt";
import service from "../../service/VendorService/service.service";

const serviceRouter = Router()
const ss = new service()


serviceRouter.get("/:id",  VendorverifyToken, ss.servicebyId)





export default serviceRouter