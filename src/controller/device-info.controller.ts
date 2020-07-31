import BaseController from './base.controller'
import { Request, Response } from 'express'
import controllerErrorHandler from '../middleware/controller-error-handler.middleware'
import DeviceInfoService from '../service/device-info.service'
import CONFIG from '../config'

export default class DeviceInfoController extends BaseController {
  constructor(service: DeviceInfoService) {
    super(service)
    this.service = service
  }

  saveDeviceInfo = controllerErrorHandler(
    async (req: Request, res: Response) => {
      try {
        const dInfo = await this.service.post(req.body)
        if (!dInfo)
          return res.status(500).send({ msg: `Couldn't save Device info` })
        res.status(201).send(dInfo)
      } catch (e) {
        res.status(500).send({
          message: `${CONFIG.RES_ERROR} ${e.message}`,
        })
      }
    }
  )
}
