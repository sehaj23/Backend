import { Router } from "express";
import VendorverifyToken from "../../middleware/VendorJwt";
import MakeupartistServiceC from "../../service/VendorService/makeupartist.service"

const makeupArtistRouter = Router()
const ma = new MakeupartistServiceC()

makeupArtistRouter.post("/", VendorverifyToken, ma.post)
makeupArtistRouter.patch("/:id",VendorverifyToken,ma.patchMakeupArtist)
makeupArtistRouter.put("/settings/:id",VendorverifyToken,ma.makeupArtistSettings)
makeupArtistRouter.put("/:id/service", VendorverifyToken, ma.addMakeupArtistService)
makeupArtistRouter.put("/:id/service/delete/:sid", VendorverifyToken, ma.deleteMakeupArtistService)
makeupArtistRouter.get("/:id/service", VendorverifyToken, ma.getService)



export default makeupArtistRouter