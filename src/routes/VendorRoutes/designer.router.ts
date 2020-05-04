import { Router } from "express";
import VendorverifyToken from "../../middleware/VendorJwt";
import DesignerService from "../../service/VendorService/designer.service";
const designerRouter = Router()
const ds = new DesignerService()



designerRouter.post("/",VendorverifyToken,ds.post)
designerRouter.put("/settings/:id",VendorverifyToken,ds.DesignerSettings)

export default designerRouter