import { Router } from "express";
import verifyToken from "../../middleware/jwt";
import EventService from "../../service/event.service"
import Event from "../../models/event.model"
import EventController from "../../controller/event.controller";
const eventRouter = Router()
const es = new EventService(Event)
const eventContrller = new EventController(es);

eventRouter.get("/", verifyToken, eventContrller.get)
eventRouter.get("/:id", verifyToken, eventContrller.getId)
eventRouter.post("/", verifyToken, eventContrller.post)
eventRouter.put("/:id", verifyToken, eventContrller.put)
// eventRouter.put("/:id/photo", verifyToken, es.putPhoto)
eventRouter.get("/:id/photo", verifyToken, eventContrller.getPhoto)


export default eventRouter
