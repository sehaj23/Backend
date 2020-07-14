import { Router } from 'express'
import SalonInfoService from '../../service/UserService/salon.service'
const ss = new SalonInfoService()
import { salonInfoChecks } from '../../validators/salon-validator'
import mySchemaValidator from '../../middleware/my-schema-validator'

const salonInfoRouter = Router()
// get salon info by id
//@ts-ignore
salonInfoRouter.get(
  '/info/:id',
  [salonInfoChecks, mySchemaValidator],
  ss.getSalonInfo
)
// get names of  all salons
salonInfoRouter.get('/names', ss.getSalonNames)
//get nearby salon range 2km
salonInfoRouter.get('/location', ss.getSalonNearby)
//sort by distance
salonInfoRouter.get('/distance', ss.getSalonDistance)
//sort rating-wise
salonInfoRouter.get('/sort', ss.getSalonsRw)

export default salonInfoRouter
