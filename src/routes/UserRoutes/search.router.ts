import { Router } from "express"
import SalonController from "../../controller/salon.controller"
import Banner from "../../models/banner.model"
import Booking from '../../models/booking.model'
import Brand from "../../models/brands.model"
import Employee from "../../models/employees.model"
import Event from "../../models/event.model"
import Offer from "../../models/offer.model"
import PromoCode from "../../models/promo-code.model"
import PromoHomeCode from "../../models/promo-home.model"
import ReportSalon from "../../models/reportSalon.model"
import Review from '../../models/review.model'
import Salon from "../../models/salon.model"
import UserSearch from "../../models/user-search.model"
import User from "../../models/user.model"
import Vendor from "../../models/vendor.model"
import BannerService from "../../service/banner.service"
import PromoCodeService from "../../service/promo-code.service"
import PromoHomeService from "../../service/promo-home.service"
import SalonService from "../../service/salon.service"
import UserSearchService from "../../service/user-search.service"
import UserService from "../../service/user.service"
const searchRouter = Router()
const salonService = new SalonService(Salon,Employee,Vendor,Event,Offer,Review,Booking,Brand,ReportSalon)
const userSearchService = new UserSearchService(UserSearch)
const userService = new UserService(User,Booking)
const promoCodeService = new PromoCodeService(PromoCode)
const promoHomeService = new PromoHomeService(PromoHomeCode)
const bannerService = new BannerService(Banner)
const salonController = new SalonController(salonService, userSearchService,userService,promoCodeService,promoHomeService,bannerService)
searchRouter.get("/", salonController.getSearchResult)
searchRouter.get("/salon",salonController.searchFilter)
searchRouter.get("/category",salonController.getSalonCategory)
searchRouter.get("/service",salonController.getSearchedService)

export default searchRouter
