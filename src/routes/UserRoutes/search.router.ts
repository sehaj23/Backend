import { Router } from "express"
import SalonInfoService from "../../service/UserService/salon.service"
const ss = new SalonInfoService()

const searchRouter = Router()

searchRouter.get("/", ss.getSalon)

export default searchRouter
