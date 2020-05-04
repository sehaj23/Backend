import { Router } from "express";
import VendorverifyToken from "../../middleware/VendorJwt";
import SalonService from "../../service/VendorService/salon.service";

const salonRouter = Router()
const ss = new SalonService()

salonRouter.post("/", VendorverifyToken, ss.post)
salonRouter.put("/settings/:id",VendorverifyToken,ss.SalonSettings)




export default salonRouter