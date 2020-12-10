import { Request, Response } from 'express'
import BaseController from './base.controller'
import controllerErrorHandler from '../middleware/controller-error-handler.middleware'
import ZattireService from '../service/zattire-service'


export default class ZattireServiceController extends BaseController {
  


  constructor(service: ZattireService) {
    super(service)
    this.service = service

  }

  create = controllerErrorHandler( async (req: Request, res: Response)=>{
    const option = req.body.options 
    const services = await this.service.post(option)
    res.status(201).send({success:true,message:"Services created"})
  })
}