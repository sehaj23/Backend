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
makeupArtistRouter.put("/:id/photo", verifyToken, ma.putPhoto)
makeupArtistRouter.get("/:id/photo", verifyToken, ma.getPhoto)

export default makeupArtistRouter
