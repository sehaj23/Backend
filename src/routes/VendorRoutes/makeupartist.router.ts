import { Router } from "express";
import VendorverifyToken from "../../middleware/jwt";
import MakeupartistServiceC from "../../service/VendorService/makeupartist.service"

const makeupArtistRouter = Router()
const ma = new MakeupartistServiceC()

makeupArtistRouter.post("/", VendorverifyToken, ma.post)



export default makeupArtistRouter