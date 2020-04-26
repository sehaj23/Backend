import { Router } from "express";
import verifyToken from "../middleware/jwt";
import MakeupartistServiceC from "../service/makeupartist.service"

const makeupArtistRouter = Router()
const ma = new MakeupartistServiceC()
makeupArtistRouter.get("/", verifyToken, ma.get)
makeupArtistRouter.get("/:id", verifyToken, ma.getId)
makeupArtistRouter.post("/", verifyToken, ma.post)
makeupArtistRouter.put("/:id", verifyToken, ma.put)
makeupArtistRouter.post("/event", verifyToken, ma.addMakeupArtistEvent)
makeupArtistRouter.post("/event/delete", verifyToken, ma.deleteMakeupArtistEvent)
makeupArtistRouter.put("/:id/service", verifyToken, ma.addMakeupArtistService)
makeupArtistRouter.put("/:id/service/delete/:sid", verifyToken, ma.deleteMakeupArtistService)
makeupArtistRouter.put("/:id/employee", verifyToken, ma.addMakeupArtistEmployee)
makeupArtistRouter.put("/:id/employee/delete/:eid", verifyToken, ma.deleteMakeupArtistEmployee)
makeupArtistRouter.put("/:id/photo", verifyToken, ma.putPhoto)
makeupArtistRouter.get("/:id/photo", verifyToken, ma.getPhoto)

export default makeupArtistRouter
