import Salon from '../../models/salon.model'
import { Request, Response } from 'express'
import CONFIG from '../../config'
import BaseService from './base.service'
import { SalonRedis } from '../../redis/index.redis'

export default class serviceService extends BaseService {
  constructor() {
    super(Salon)
  }

  // Service names
  getServiceNames = async (req: Request, res: Response) => {
    try {
      const data = []
      const salonName = req.query.salon
      let salons
      const sr = await SalonRedis.get('Salons')
      if (sr !== null) salons = JSON.parse(sr)
      else {
        salons = await Salon.find()
        SalonRedis.set('Salons', salons)
      }
      if (!salonName)
        for (let [key, value] of Object.entries(salons))
        //@ts-ignore
          value.services.forEach((x) => data.push(x.name))
      else {
        // const salonInfo = await Salon.findOne({ name: salonName })
        // salonInfo.services.forEach((x) => data.push(x.name))
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
      const data = new Array()
      let salons
      const sr = await SalonRedis.get('Salons')
      if (sr !== null) salons = JSON.parse(sr)
      else {
        salons = await Salon.find()
        SalonRedis.set('Salons', salons)
      }
      const val1 = price === 'asc' ? -1 : 1
      const val2 = -val1
      for (let [key, value] of Object.entries(salons))
      //@ts-ignore
        value.services.forEach((x) => data.push(x))
      data.sort((a, b) => (a.price < b.price ? val1 : val2))
      res.status(200).send(data)
    } catch (e) {
      res.status(500).send({
        message: `${CONFIG.RES_ERROR} ${e.message}`,
      })
    }
  }
}
