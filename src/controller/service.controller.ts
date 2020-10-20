import { Request, Response } from 'express'
import BaseController from './base.controller'
import ServiceService from '../service/service.service'
import controllerErrorHandler from '../middleware/controller-error-handler.middleware'
import { SalonRedis } from '../redis/index.redis'
import CONFIG from '../config'

export default class ServiceController extends BaseController {
  service: ServiceService
  constructor(service: ServiceService) {
    super(service)
    this.service = service
  }

  getServiceNames = controllerErrorHandler(
    async (req: Request, res: Response) => {
      try {
        const data = []
        const salonName = req.query.salon
        let salons
        // const sr = await SalonRedis.get('Salons')
        // if (sr !== null) salons = JSON.parse(sr)
        // else {
          salons = await this.service.getAll()
          // SalonRedis.set('Salons', salons)
        // }
        if (!salonName)
          for (let [key, value] of Object.entries(salons))
          //@ts-ignore
            value.services.forEach((x) => data.push(x.name))
        else {
          const salonInfo = await this.service.getByName(salonName.toString())
          salonInfo.services.forEach((x) => data.push(x.name))
        }
        res.status(200).send(data)
      } catch (e) {
        res.status(500).send({
          message: `${CONFIG.RES_ERROR} ${e.message}`,
        })
      }
    }
  )

  getServicePw = controllerErrorHandler(async (req: Request, res: Response) => {
    try {
      const price = req.query.price
      if (price !== 'asc' && price !== 'dsc')
        return res.status(400).send({ message: 'Send valid sorting order' })
      const data = new Array()
      let salons
      const sr = await SalonRedis.get('Salons')
      if (sr !== null) salons = JSON.parse(sr)
      else {
        salons = await this.service.getAll()
        SalonRedis.set('Salons', salons)
      }
      const order = price === 'asc' ? 1 : -1
      for (let [key, value] of Object.entries(salons))
      //@ts-ignore
        value.services.forEach((x) => data.push(x))
      data.sort((a, b) => (a.price > b.price ? order : -order))
      res.status(200).send(data)
    } catch (e) {
      res.status(500).send({
        message: `${CONFIG.RES_ERROR} ${e.message}`,
      })
    }
  })
}
