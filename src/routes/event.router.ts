import { Router } from "express";
import verifyToken from "../middleware/jwt";
import EventService from "../service/event.service";

const eventRouter = Router()
eventRouter.get("/", verifyToken, EventService.get)
eventRouter.get("/:id", verifyToken, EventService.getId)
eventRouter.post("/", verifyToken, EventService.post)
eventRouter.put("/:id", verifyToken, EventService.put)
eventRouter.put("/:id/photo", verifyToken, EventService.putPhoto)
eventRouter.get("/:id/photo", verifyToken, EventService.getPhoto)


export default eventRouter
