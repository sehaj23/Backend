import { Router } from "express";
import VendorverifyToken from "../../middleware/jwt";
import SalonService from "../../service/VendorService/salon.service";

const salonRouter = Router()
const ss = new SalonService()

salonRouter.post("/", VendorverifyToken, ss.post)



export default salonRouter