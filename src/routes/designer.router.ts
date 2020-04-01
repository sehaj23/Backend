import { Router } from "express";
import verifyToken from "../middleware/jwt";
import DesignerService from "../service/designer.service";

const designerRouter = Router()
designerRouter.get("/", verifyToken, DesignerService.get)
designerRouter.get("/:id", verifyToken, DesignerService.getId)
designerRouter.post("/", verifyToken, DesignerService.post)
designerRouter.put("/", verifyToken, DesignerService.put)
designerRouter.post("/addEvent", verifyToken, DesignerService.addDesignerEvent)
designerRouter.get("/getEvents", verifyToken, DesignerService.getDesignerEvent)

export default designerRouter
