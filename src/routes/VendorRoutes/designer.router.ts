import { Router } from "express";
import VendorverifyToken from "../../middleware/VendorJwt";
import DesignerService from "../../service/designer.service";
import Designer from "../../models/designers.model";
import Vendor from "../../models/vendor.model"
import Event from "../../models/event.model"
import DesignerController from "../../controller/designer.controller";
const designerRouter = Router()
const designerService = new DesignerService(Designer,Vendor,Event)
const designerController = new DesignerController(designerService)



<<<<<<< HEAD
designerRouter.post("/",VendorverifyToken,ds.post)
designerRouter.patch("/:id",VendorverifyToken,ds.patchDesigner)
designerRouter.get("/:id",VendorverifyToken,ds.getId)
designerRouter.put("/settings/:id",VendorverifyToken,ds.designerSettings)
designerRouter.get("/:id/photo", VendorverifyToken, ds.getPhoto)
=======
designerRouter.post("/",VendorverifyToken,designerController.postDesigner)
designerRouter.patch("/:id",VendorverifyToken,designerController.patchDesigner)
designerRouter.get("/:id",VendorverifyToken,designerController.getId)
designerRouter.put("/settings/:id",VendorverifyToken,designerController.designerSettings)
>>>>>>> controller-service

export default designerRouter