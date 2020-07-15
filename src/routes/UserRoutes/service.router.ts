import { Router } from 'express'
import ServiceService from '../../service/service.service'
import Salon from '../../models/salon.model'
import ServiceController from '../../controller/service.controller'

const serviceRouter = Router()
const serviceService = new ServiceService(Salon)
const serviceController = new ServiceController(serviceService)

// get names of  services
serviceRouter.get('/services', serviceController.getServiceNames)
// sort price-wise
serviceRouter.get('/sort', serviceController.getServicePw)

export default serviceRouter
