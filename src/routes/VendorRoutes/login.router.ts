import { Router } from "express";
import LoginService from "../../service/VendorService/login.service";
import VendorverifyToken from "../../middleware/VendorJwt";
import VendorService from "../../service/AdminService/vendor.service";
const ls = new  LoginService()


const loginRouter = Router()
loginRouter.post("/", ls.vendorPost)
loginRouter.post("/create", ls.createVendor)
loginRouter.get("/vendor",VendorverifyToken,ls.get)
loginRouter.put("/:id/profile-pic", VendorverifyToken, ls.putProfilePic)

export default loginRouter
