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
salonRouter.put("/:id/service", verifyToken, ss.addSalonService)
salonRouter.put("/:id/service/delete/:sid", verifyToken, ss.deleteSalonService)
salonRouter.put("/:id/employee", verifyToken, ss.addSalonEmployee)
salonRouter.put("/:id/photo", verifyToken, ss.putPhoto)
salonRouter.get("/:id/photo", verifyToken, ss.getPhoto)

// designerRouter.get("/event/get", verifyToken, DesignerService.getDesignerEvent)

export default salonRouter
