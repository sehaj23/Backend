import { Router } from 'express'
import serviceService from '../../service/UserService/service.service'
const ss = new serviceService()

const serviceRouter = Router()

// get names of  services
serviceRouter.get('/services', ss.getServiceNames)
// sort price-wise
serviceRouter.get('/sort', ss.getServiceRw)

export default serviceRouter
