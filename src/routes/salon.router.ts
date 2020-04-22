import { Router } from "express";
import verifyToken from "../middleware/jwt";
import SalonService from "../service/salon.service";

const salonRouter = Router()
const ss = new SalonService()
salonRouter.get("/", verifyToken, ss.get)
salonRouter.get("/:id", verifyToken, ss.getId)
salonRouter.post("/", verifyToken, ss.post)
salonRouter.put("/:id", verifyToken, ss.put)
salonRouter.post("/event", verifyToken, ss.addSalonEvent)
salonRouter.put("/salon", verifyToken, ss.addSalonService)
salonRouter.put("/:id/photo", verifyToken, ss.putPhoto)
salonRouter.get("/:id/photo", verifyToken, ss.getPhoto)

// designerRouter.get("/event/get", verifyToken, DesignerService.getDesignerEvent)

export default salonRouter
