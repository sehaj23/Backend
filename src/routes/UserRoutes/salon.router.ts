import { Router } from 'express'
import SalonInfoService from '../../service/UserService/salon.service'
const ss = new SalonInfoService()
import { salonInfoChecks } from '../../validators/salon-validator'
import mySchemaValidator from '../../middleware/my-schema-validator'
import SalonService from "../../service/salon.service";
import Salon from "../../models/salon.model";
import SalonController from "../../controller/salon.controller";
import Employee from "../../models/employees.model";
import Vendor from "../../models/vendor.model";
import Event from "../../models/event.model"
import Offer from "../../models/offer.model";
import Review from '../../models/review.model'
import UserverifyToken from '../../middleware/User.jwt'
import Booking from '../../models/booking.model'
import Brand from '../../models/brands.model'
const salonService = new SalonService(Salon,Employee,Vendor,Event,Offer,Review,Booking,Brand)
const salonController = new SalonController(salonService)

const salonInfoRouter = Router()
// get salon info by id
//@ts-ignore
salonInfoRouter.get(
  '/info/:id',
  [salonInfoChecks, mySchemaValidator],
  salonController.getSalonInfo
)
// get names of recommended all salons
salonInfoRouter.get('/names', salonController.getRecomendSalon)
//get nearby salon range 2km
salonInfoRouter.get('/location', salonController.getSalonNearby)
//sort by distance
salonInfoRouter.get('/distance', salonController.getSalonDistance)
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




export default salonInfoRouter
