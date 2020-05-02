import { Router } from "express";
import LoginService from "../../service/VendorService/login.service";

const loginRouter = Router()
loginRouter.post("/", LoginService.Vendorpost)
loginRouter.post("/create", LoginService.createVendor)


export default loginRouter
