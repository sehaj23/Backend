import { Request, Response } from 'express'
import BaseController from './base.controller'
import controllerErrorHandler from '../middleware/controller-error-handler.middleware'
import ZattireService from '../service/zattire-service'
import { ServicesI } from '../interfaces/zattire-service.interface'


export default class ZattireServiceController extends BaseController {
  service:ZattireService
  constructor(service: ZattireService) {
    super(service)
    this.service = service

  }

  create = controllerErrorHandler( async (req: Request, res: Response)=>{
    const option = req.body.options 
    const services = await this.service.post(option)
    res.status(201).send({success:true,message:"Services created"})
  })

  addService = controllerErrorHandler(async (req: Request, res: Response) => {
    const id = req.params.id
    const services:ServicesI= req.body.services
    const addServices = await this.service.addServiceToCategory(id,services)
    if(!addServices){
      return res.status(400).send({success:false,message:"error updating"})
    }
    res.status(200).send({success:true,message:"Added"})
})
}