import BaseController from './base.controller'
import AdminService from '../service/admin.service'
import { Request, Response } from 'express'
import controllerErrorHandler from '../middleware/controller-error-handler.middleware'
import DeviceInfo from '../models/deviceInfo.model'
import DeviceInfoService from '../service/device-info.service'

export default class DeviceInfoController extends BaseController {
  constructor(service: DeviceInfoService) {
    super(service)
    this.service = service
  }

  saveDeviceInfo = controllerErrorHandler(
    async (req: Request, res: Response) => {
      const dInfo = await this.service.post(req.body)
      if(!dInfo) return res.status(500).send({msg: `Couldn't save Device info` })
      res.status(201).send(dInfo)
    }
  )
}
