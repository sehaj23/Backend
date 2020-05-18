import { Router } from "express";
import LoginService from "../../service/VendorService/login.service";
import VendorverifyToken from "../../middleware/VendorJwt";

const loginRouter = Router()
loginRouter.post("/", LoginService.vendorPost)
loginRouter.post("/create", LoginService.createVendor)
loginRouter.get("/vendor",VendorverifyToken,LoginService.get)



export default loginRouter
