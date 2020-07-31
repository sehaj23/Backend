import { Router } from "express"
import SalonInfoService from "../../service/UserService/salon.service"
import SalonService from "../../service/salon.service"
import Salon from "../../models/salon.model"
import Employee from "../../models/employees.model"
import Vendor from "../../models/vendor.model"
import Event from "../../models/event.model"
import Offer from "../../models/offer.model"
import SalonController from "../../controller/salon.controller"
const ss = new SalonInfoService()

const searchRouter = Router()

const salonService = new SalonService(Salon,Employee,Vendor,Event,Offer)
const salonController = new SalonController(salonService)
searchRouter.get("/", salonController.getSearchResult)

export default searchRouter
