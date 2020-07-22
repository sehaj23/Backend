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
const salonService = new SalonService(Salon,Employee,Vendor,Event,Offer)
const salonController = new SalonController(salonService)

const salonInfoRouter = Router()
// get salon info by id
//@ts-ignore
salonInfoRouter.get(
  '/info/:id',
  [salonInfoChecks, mySchemaValidator],
  salonController.getSalonInfo
)
// get names of  all salons
salonInfoRouter.get('/names', salonController.getSalonNames)
//get nearby salon range 2km
salonInfoRouter.get('/location', salonController.getSalonNearby)
//sort by distance
salonInfoRouter.get('/distance', salonController.getSalonDistance)
//sort rating-wise
salonInfoRouter.get('/sort', salonController.getSalonsRw)

export default salonInfoRouter
