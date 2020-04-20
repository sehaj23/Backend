import { Router } from "express";
import verifyToken from "../middleware/jwt";
import DesignerService from "../service/designer.service";

const designerRouter = Router()
const ds = new DesignerService()
designerRouter.get("/", verifyToken, ds.get)
designerRouter.get("/:id", verifyToken, ds.getId)
designerRouter.post("/", verifyToken, ds.post)
designerRouter.put("/:id", verifyToken, ds.put)
designerRouter.post("/event", verifyToken, ds.addDesignerEvent)
designerRouter.delete("/event", verifyToken, ds.deleteDesignerEvent)
designerRouter.put("/:id/photo", verifyToken, ds.putPhoto)
designerRouter.get("/:id/photo", verifyToken, ds.getPhoto)

// designerRouter.get("/event/get", verifyToken, DesignerService.getDesignerEvent)

export default designerRouter
