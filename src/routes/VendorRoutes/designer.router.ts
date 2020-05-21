import { Router } from "express";
import VendorverifyToken from "../../middleware/VendorJwt";
import DesignerService from "../../service/VendorService/designer.service";
const designerRouter = Router()
const ds = new DesignerService()



designerRouter.post("/",VendorverifyToken,ds.post)
designerRouter.patch("/:id",VendorverifyToken,ds.patchDesigner)
designerRouter.get("/:id",VendorverifyToken,ds.getId)
designerRouter.put("/settings/:id",VendorverifyToken,ds.designerSettings)

export default designerRouter