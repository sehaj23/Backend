import Salon from '../../models/salon.model'
import Service from '../../models/service.model'
import { Request, Response } from 'express'
import CONFIG from '../../config'
import BaseService from './base.service'

export default class serviceService extends BaseService {
  constructor() {
    super(Service)
  }

  // Service names
  getServiceNames = async (req: Request, res: Response) => {
    try {
      const services = await Service.find({})
      const data = new Array()
      const salonName = req.query.salon
      if (!salonName) {
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
  getServiceRw = async (req: Request, res: Response) => {
    try {
      const services = await Service.find({}).populate('salon_id').exec()
      const data = new Array()
      const price = req.query.price
      if (price !== 'asc' && price !== 'dsc') return res.status(400).send()
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
