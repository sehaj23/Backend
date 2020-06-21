import {
    Router
} from "express";
import LoginService from "../../service/UserService/user.login.service";
import UserverifyToken from "../../middleware/User.jwt";
const ls = new LoginService()

const loginRouter = Router()
loginRouter.post("/", ls.verifyUser)
loginRouter.post("/create", ls.createUser)
loginRouter.get("/user", UserverifyToken, ls.get)
loginRouter.put("/:id/profile-pic", UserverifyToken, ls.putProfilePic)

export default loginRouter