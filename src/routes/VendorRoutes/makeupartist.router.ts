import { Router } from "express";
import VendorverifyToken from "../../middleware/VendorJwt";
import MakeupartistServiceC from "../../service/VendorService/makeupartist.service"

const makeupArtistRouter = Router()
const ma = new MakeupartistServiceC()

makeupArtistRouter.post("/", VendorverifyToken, ma.post)
makeupArtistRouter.patch("/:id",VendorverifyToken,ma.patchMakeupArtist)
makeupArtistRouter.put("/settings/:id",VendorverifyToken,ma.makeupArtistSettings)



export default makeupArtistRouter