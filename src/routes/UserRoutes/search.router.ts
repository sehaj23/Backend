import { Router } from "express"
import SalonService from "../../service/salon.service"
import Salon from "../../models/salon.model"
import Employee from "../../models/employees.model"
import Vendor from "../../models/vendor.model"
import Event from "../../models/event.model"
import Offer from "../../models/offer.model"
import SalonController from "../../controller/salon.controller"
import Review from '../../models/review.model'
import Booking from '../../models/booking.model'
import Brand from "../../models/brands.model"

const searchRouter = Router()
const salonService = new SalonService(Salon,Employee,Vendor,Event,Offer,Review,Booking,Brand)
const salonController = new SalonController(salonService)
searchRouter.get("/", salonController.getSearchResult)
searchRouter.get("/salon",salonController.searchFilter)

export default searchRouter
