import { Router } from "express";
import VendorverifyToken from "../../middleware/VendorJwt";
import MakeupartistServiceC from "../../service/VendorService/makeupartist.service"

const makeupArtistRouter = Router()
const ma = new MakeupartistServiceC()

makeupArtistRouter.post("/", VendorverifyToken, ma.post)
makeupArtistRouter.put("/settings/:id",VendorverifyToken,ma.MakeupArtistSettings)



export default makeupArtistRouter