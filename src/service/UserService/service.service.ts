import Salon from '../../models/salon.model'
import Service from '../../models/service.model'
import { Request, Response } from 'express'
import CONFIG from '../../config'
import BaseService from './base.service'
import { ServiceRedis } from '../../redis/index.redis'

export default class serviceService extends BaseService {
  constructor() {
    super(Service)
  }

  // Service names
  getServiceNames = async (req: Request, res: Response) => {
    try {
      const data = new Array()
      const salonName = req.query.salon
      let services
      const sr = await ServiceRedis.get('Services')
      if (sr !== null) services = JSON.parse(sr)
      else {
        services = await Service.find()
        ServiceRedis.set('Services', services)
      }
      if (!salonName) {
        //@ts-ignore
        for (let [key, value] of Object.entries(services)) data.push(value.name)
      } else {
        const salonInfo = await Salon.findOne({ name: salonName })
          .populate('services')
          .exec()
        for (let [key, value] of Object.entries(salonInfo.services))
          data.push(value.name)
      }
      res.status(200).send(data)
    } catch (e) {
      res.status(500).send({
        message: `${CONFIG.RES_ERROR} ${e.message}`,
      })
    }
  }

  // Sort services : price-wise
  getServicePw = async (req: Request, res: Response) => {
    try {
      const price = req.query.price
      if (price !== 'asc' && price !== 'dsc')
        return res.status(400).send({ message: 'Send valid sorting order' })
      const services = await Service.find({}).populate('salon_id').exec()
      const data = new Array()
      const val1 = price === 'asc' ? -1 : 1
      const val2 = val1 * -1
      for (let [key, value] of Object.entries(services)) data.push(value)
      data.sort((a, b) => (a.price < b.price ? val1 : val2))
      res.status(200).send(data)
    } catch (e) {
      res.status(500).send({
        message: `${CONFIG.RES_ERROR} ${e.message}`,
      })
    }
  }
}
