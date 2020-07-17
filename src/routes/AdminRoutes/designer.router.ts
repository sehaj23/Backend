import { Router } from "express";
import verifyToken from "../../middleware/jwt";
import DesignerService from "../../service/designer.service";
import Designer from "../../models/designers.model";
import Vendor from "../../models/vendor.model"
import Event from "../../models/event.model"
import DesignerController from "../../controller/designer.controller";

const designerService = new DesignerService(Designer,Vendor,Event)
const designerController = new DesignerController(designerService)

const designerRouter = Router()

designerRouter.get("/", verifyToken, designerController.get)
designerRouter.get("/:id", verifyToken, designerController.getId)
designerRouter.post("/", verifyToken, designerController.post)
designerRouter.put("/:id", verifyToken, designerController.put)
designerRouter.post("/event", verifyToken, designerController.addDesignerEvent)
designerRouter.delete("/event/delete", verifyToken, designerController.deleteDesignerEvent)
designerRouter.put("/:id/photo", verifyToken, designerController.putPhoto)
designerRouter.get("/:id/photo", verifyToken, designerController.getPhoto)

// designerRouter.get("/event/get", verifyToken, DesignerService.getDesignerEvent)

export default designerRouter
