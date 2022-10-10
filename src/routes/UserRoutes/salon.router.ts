import { Router } from 'express';
import SalonController from "../../controller/salon.controller";
import mySchemaValidator from '../../middleware/my-schema-validator';
import openVerifyToken from '../../middleware/openJWT';
import UserverifyToken from '../../middleware/User.jwt';
import Banner from '../../models/banner.model';
import Booking from '../../models/booking.model';
import Brand from '../../models/brands.model';
import Employee from "../../models/employees.model";
import Event from "../../models/event.model";
import Offer from "../../models/offer.model";
import PromoCode from '../../models/promo-code.model';
import PromoHomeCode from '../../models/promo-home.model';
import ReportSalon from "../../models/reportSalon.model";
import Review from '../../models/review.model';
import Salon from "../../models/salon.model";
import UserSearch from '../../models/user-search.model';
import User from '../../models/user.model';
import Vendor from "../../models/vendor.model";
import BannerService from '../../service/banner.service';
import PromoCodeService from '../../service/promo-code.service';
import PromoHomeService from '../../service/promo-home.service';
import SalonService from "../../service/salon.service";
import UserSearchService from '../../service/user-search.service';
import UserService from '../../service/user.service';
import { salonInfoChecks } from '../../validators/salon-validator';
const salonService = new SalonService(Salon,Employee,Vendor,Event,Offer,Review,Booking,Brand,ReportSalon)
const userSearchService = new UserSearchService(UserSearch)

const userService = new UserService(User,Booking)
const promoCodeService = new PromoCodeService(PromoCode)
const promoHomeService = new PromoHomeService(PromoHomeCode)
const bannerService = new BannerService(Banner)
const salonController = new SalonController(salonService, userSearchService,userService,promoCodeService,promoHomeService,bannerService)

const salonInfoRouter = Router()
// get salon info by id
//@ts-ignore
salonInfoRouter.get(
  '/info/:id',
  [salonInfoChecks, mySchemaValidator],
  salonController.getSalonInfo
)
//@ts-ignore
salonInfoRouter.get(
  '/information/:id',
  [salonInfoChecks, mySchemaValidator],
  salonController.getSalonInfoByID
)
// get all home page salons
salonInfoRouter.get("/home-page",salonController.getHomePageSalon)
// get names of recommended all salons
salonInfoRouter.get('/names',salonController.getRecomendSalon)
//get nearby salon range 30km
salonInfoRouter.get('/location', salonController.getSalonNearby)
//sort by distance
salonInfoRouter.get('/distance', salonController.getSalonDistance)
// get salon by promo codes 
salonInfoRouter.get('/promo-code/:id',salonController.getSalonByPromo)
//sort rating-wise
//salonInfoRouter.get('/sort', salonController.getSalonsRw)
//get home service salons
salonInfoRouter.get('/homesalons',salonController.getHomeServiceSalon)
//get categories
salonInfoRouter.get('/category/:id',salonController.getSalonCategories)
//get services use query
salonInfoRouter.get('/services/:id',salonController.getService)
//post Reviews
salonInfoRouter.post('/reviews/:id',UserverifyToken,salonController.postSalonReviews)
// get Reviews
salonInfoRouter.get('/reviews/:id',salonController.getSalonReviews)
// check if user can Post Reviews
salonInfoRouter.get('/reviews/check/:id',UserverifyToken,salonController.checkPostReviews)
salonInfoRouter.get('/brands',salonController.getBrands)
salonInfoRouter.get('/brand/:id',salonController.getBrandbyId)
salonInfoRouter.post("/report/",UserverifyToken, salonController.reportSalon)
salonInfoRouter.get("/reviews/ratings/:id",salonController.getRatings)
salonInfoRouter.get("/slots/:id",UserverifyToken,salonController.salonSlots)
salonInfoRouter.get("/getDistance",UserverifyToken,salonController.getDistanceInPairs)
salonInfoRouter.get("/top-brands",salonController.getTopBrands)


export default salonInfoRouter 
