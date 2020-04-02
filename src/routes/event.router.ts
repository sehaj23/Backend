import { Router } from "express";
import verifyToken from "../middleware/jwt";
import EventService from "../service/event.service";

const eventRouter = Router()
eventRouter.get("/", verifyToken, EventService.get)
eventRouter.get("/:id", verifyToken, EventService.getId)
eventRouter.post("/", verifyToken, EventService.post)
eventRouter.put("/", verifyToken, EventService.put)

export default eventRouter