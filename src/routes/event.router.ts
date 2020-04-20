import { Router } from "express";
import verifyToken from "../middleware/jwt";
import EventService from "../service/event.service";

const eventRouter = Router()
const es = new EventService()

eventRouter.get("/", verifyToken, es.get)
eventRouter.get("/:id", verifyToken, es.getId)
eventRouter.post("/", verifyToken, es.post)
eventRouter.put("/:id", verifyToken, es.put)
eventRouter.put("/:id/photo", verifyToken, es.putPhoto)
eventRouter.get("/:id/photo", verifyToken, es.getPhoto)


export default eventRouter
