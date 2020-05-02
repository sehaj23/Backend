import { Router } from "express";
import VendorverifyToken from "../../middleware/jwt";
import DesignerService from "../../service/VendorService/designer.service";
const designerRouter = Router()
const ds = new DesignerService()



designerRouter.post("/",VendorverifyToken,ds.post)

export default designerRouter