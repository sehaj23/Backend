import { Router } from "express";
import verifyToken from "../middleware/jwt";
import MakeupartistServiceC from "../service/makeupartist.service"

const makeupArtistRouter = Router()
makeupArtistRouter.get("/", verifyToken, MakeupartistServiceC.get)
makeupArtistRouter.get("/:id", verifyToken, MakeupartistServiceC.getId)
makeupArtistRouter.post("/", verifyToken, MakeupartistServiceC.post)
makeupArtistRouter.put("/", verifyToken, MakeupartistServiceC.put)
makeupArtistRouter.post("/add", verifyToken, MakeupartistServiceC.addMakeupArtistEvent)
makeupArtistRouter.get("/designer", verifyToken, MakeupartistServiceC.getMakeupArtistEvent)

export default makeupArtistRouter
