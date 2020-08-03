import { Router } from "express";

import VendorverifyToken from "../../middleware/VendorJwt";
import VendorService from "../../service/vendor.service";
import CONFIG from '../../config'
import Vendor from '../../models/vendor.model'
import LoginController from '../../controller/login.controller'
import LoginService from '../../service/login.service'

// const ls = new  LoginService()


const loginRouter = Router()
const loginService = new LoginService(Vendor)
const loginController = new LoginController(loginService, CONFIG.VENDOR_JWT, '7 days')

loginRouter.post("/", loginController.login)
loginRouter.post("/create", loginController.create)

// loginRouter.post("/", ls.vendorPost)
// loginRouter.post("/create", ls.createVendor)


// loginRouter.get("/vendor",VendorverifyToken,ls.get)
// loginRouter.put("/:id/profile-pic", VendorverifyToken, ls.putProfilePic)

export default loginRouter
